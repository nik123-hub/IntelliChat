import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "../config/axios.js";
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket.js';
import { UserContext } from '../context/user.context.jsx';
import Markdown from 'markdown-to-jsx';

const Project = () => {
    const location = useLocation();
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [project, setProject] = useState(location.state.project);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();
    const messageBoxRef = useRef(null);
    const shouldScrollRef = useRef(true);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedDarkMode = localStorage.getItem('darkMode');
        return savedDarkMode ? JSON.parse(savedDarkMode) : false;
    });
    const { user } = useContext(UserContext);
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem(`projectMessages_${location.state.project._id}`);
        return savedMessages ? JSON.parse(savedMessages) : [];
    });

    // Function to scroll to bottom of messages
    const scrollToBottom = () => {
        if (messageBoxRef.current && shouldScrollRef.current) {
            messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
        }
    };

    // Handle user scroll interaction
    const handleScroll = () => {
        if (messageBoxRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messageBoxRef.current;
            const isScrolledNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            shouldScrollRef.current = isScrolledNearBottom;
        }
    };

    useEffect(() => {
        localStorage.setItem(`projectMessages_${project._id}`, JSON.stringify(messages));
        scrollToBottom();
    }, [messages, project._id]);

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    // Add scroll event listener
    useEffect(() => {
        const messageBox = messageBoxRef.current;
        if (messageBox) {
            messageBox.addEventListener('scroll', handleScroll);
            return () => messageBox.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const toggleUserSelection = (user) => {
        setSelectedUsers((prevSelected) =>
            prevSelected.some((u) => u._id === user._id)
                ? prevSelected.filter((u) => u._id !== user._id)
                : [...prevSelected, user]
        );
    };

    function addCollaborators() {
        axios.put("/project/add-user", {
            projectId: location.state.project._id,
            users: selectedUsers.map((item) => item._id),
        })
            .then((res) => {
                console.log(res.data);
                setIsModalOpen(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function appendIncomingMessage(messageObject) {
        setMessages((prevMessages) => [...prevMessages, messageObject]);
        shouldScrollRef.current = true;  // Force scroll on incoming messages
    }

    function appendOutgoingMessage(message) {
        const newMessage = {
            message: message,
            sender: user.email,
            timestamp: new Date().toISOString()
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        shouldScrollRef.current = true;  // Force scroll on outgoing messages
    }

    function send() {
        if (!message.trim()) return;

        sendMessage('project-message', {
            message: message.trim(),
            sender: user.email,
        });

        appendOutgoingMessage(message);
        setMessage("");
    }

    const clearChat = () => {
        if (window.confirm('Are you sure you want to clear all messages?')) {
            setMessages([]);
            localStorage.removeItem(`projectMessages_${project._id}`);
        }
    };

    useEffect(() => {
        initializeSocket(project._id);

        receiveMessage('project-message', (data) => {
            console.log(data);
            appendIncomingMessage(data);
        });

        axios.get('/users/all')
            .then((res) => setUsersList(res.data.allUsers))
            .catch((err) => console.error("Error fetching users:", err));

        axios.get(`/project/get-project/${location.state.project._id}`)
            .then((res) => setProject(res.data.project))
            .catch((err) => console.log(err));

        // Initial scroll to bottom
        scrollToBottom();
    }, []);

    return (
        <main className={`h-screen w-full flex transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <section className={`flex-1 h-full flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <header className={`p-3 px-5 w-full flex justify-between items-center border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'}`}>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className={`flex items-center gap-2 text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
                        >
                            <span className="text-lg">⬅️</span>
                            <p>Back to Home</p>
                        </button>
                        <button
                            className={`flex items-center gap-2 text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
                            onClick={() => setIsModalOpen(true)}
                        >
                            <span className="text-lg">➕</span>
                            <p>Add Collaborator</p>
                        </button>
                        <button
                            onClick={clearChat}
                            className={`flex items-center gap-2 text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
                        >
                            <span className="text-lg">🗑️</span>
                            <p>Clear Chat</p>
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'text-yellow-400 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-300'}`}
                        >
                            {isDarkMode ? '☀️' : '🌙'}
                        </button>
                        <button
                            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                            className={`p-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
                        >
                            👥
                        </button>
                    </div>
                </header>

                <div className="conversation-area flex-grow flex flex-col p-4">
                    <div
                        ref={messageBoxRef}
                        className={`message-box flex-grow overflow-y-auto overflow-x-hidden max-h-[calc(100vh-150px)] p-2 rounded-md space-y-2 transition-colors duration-300 flex flex-col ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border border-gray-300 bg-white'
                            }`}
                    >
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`message max-w-[80%] p-2 rounded-lg shadow-md break-words transition-all duration-300 hover:shadow-lg ${msg.sender === "AI" || msg.sender !== user?.email
                                    ? `${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-black'} self-start`
                                    : 'bg-blue-600 text-white self-end'
                                    }`}
                            >
                                <small className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {msg.sender}
                                    {msg.timestamp && (
                                        <span className="ml-2 text-xs">
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </span>
                                    )}
                                </small>
                                <div className="mt-1">
                                    <div className="message-content">
                                        <Markdown
                                            options={{
                                                overrides: {
                                                    pre: {
                                                        props: {
                                                            className: 'overflow-x-auto'
                                                        }
                                                    },
                                                    code: {
                                                        props: {
                                                            className: `p-2 rounded bg-opacity-50 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`
                                                        }
                                                    }
                                                }
                                            }}
                                        >
                                            {msg.message}
                                        </Markdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={`inputField w-full flex p-2 transition-colors duration-300 ${isDarkMode ? 'border-gray-700' : 'border-t border-gray-300'}`}>
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className={`p-2 flex-grow rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${isDarkMode
                                ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400'
                                : 'bg-white border border-gray-300 placeholder-gray-500'
                                }`}
                            type="text"
                            placeholder="Enter Your Message"
                        />
                        <button
                            onClick={send}
                            className="px-4 bg-blue-500 text-white rounded-r-lg transition-all duration-300 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                            disabled={!message.trim()}
                        >
                            ✉️
                        </button>
                    </div>
                </div>
            </section>

            <section className={`sidePanel w-72 h-full transition-all duration-300 shadow-lg fixed top-0 right-0 transform ${isSidePanelOpen ? 'translate-x-0' : 'translate-x-full'
                } ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <header className={`w-full flex justify-between items-center p-3 transition-colors duration-300 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
                    <h2 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Collaborators</h2>
                    <button
                        onClick={() => setIsSidePanelOpen(false)}
                        className={`p-2 rounded-full transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-600' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-400'
                            }`}
                    >
                        ✕
                    </button>
                </header>
                <div className="users flex flex-col gap-2 p-4">
                    {project.users && project.users.map(user => (
                        <div
                            key={user._id}
                            className={`user cursor-pointer p-3 flex gap-3 items-center rounded-lg transition-all duration-300 ${isDarkMode
                                ? 'hover:bg-gray-700 text-gray-300'
                                : 'hover:bg-gray-200 text-gray-800'
                                }`}
                        >
                            <div className="w-10 h-10 flex items-center justify-center text-white bg-blue-500 rounded-full transition-transform duration-300 hover:scale-110">
                                👤
                            </div>
                            <h1 className="font-semibold text-md">{user.email}</h1>
                        </div>
                    ))}
                </div>
            </section>

            {isModalOpen && (
                <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className={`p-6 rounded-lg shadow-lg w-96 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <h2 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            Select Collaborators
                        </h2>
                        <div className={`user-list mb-4 max-h-60 overflow-y-auto rounded-md p-2 transition-colors duration-300 ${isDarkMode ? 'border-gray-700' : 'border'
                            }`}>
                            {usersList.map(user => (
                                <div
                                    key={user._id}
                                    className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg transition-all duration-300 ${isDarkMode
                                        ? 'hover:bg-gray-700 text-gray-300'
                                        : 'hover:bg-gray-100 text-gray-800'
                                        }`}
                                    onClick={() => toggleUserSelection(user)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.some(u => u._id === user._id)}
                                        readOnly
                                        className="form-checkbox text-blue-500"
                                    />
                                    <span>{user.email}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className={`px-4 py-2 rounded transition-colors duration-300 ${isDarkMode
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addCollaborators}
                                className="px-4 py-2 bg-blue-500 text-white rounded transition-all duration-300 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Project;