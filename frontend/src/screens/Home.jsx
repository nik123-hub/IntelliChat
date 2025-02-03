import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/user.context';
import { useNavigate } from 'react-router-dom';
import axios from "../config/axios.js";

const Home = () => {
    const { user } = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [project, setProject] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedDarkMode = localStorage.getItem('darkMode');
        return savedDarkMode ? JSON.parse(savedDarkMode) : false;
    });
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    function createProject(e) {
        e.preventDefault();
        axios.post('/project/create', { name: projectName })
            .then((res) => {
                setIsModalOpen(false);
                setProject([...project, res.data.project]);
                setProjectName("");
            })
            .catch((error) => console.error(error));
    }

    useEffect(() => {
        axios.get('project/all')
            .then((res) => setProject(res.data.projects))
            .catch((error) => console.error(error));
    }, []);

    return (
        <main className={`min-h-screen p-6 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className={`text-3xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        Projects
                    </h1>
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`p-2 rounded-full transition-all duration-300 ${
                            isDarkMode ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className={`h-48 flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-300 border-2 border-dashed ${
                            isDarkMode 
                                ? 'border-gray-700 hover:border-blue-400 text-gray-400 hover:text-blue-400' 
                                : 'border-gray-300 hover:border-blue-500 text-gray-600 hover:text-blue-500'
                        }`}
                    >
                        <span className="text-4xl mb-4">➕</span>
                        <span className="text-lg font-medium">Create Project</span>
                    </button>

                    {project.map((project) => (
                        <div
                            key={project._id}
                            onClick={() => navigate(`/project`, { state: { project } })}
                            className={`h-48 flex flex-col p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
                                isDarkMode 
                                    ? 'bg-gray-800 border border-gray-700 hover:border-gray-600' 
                                    : 'bg-white border border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                {project.name}
                            </h2>
                            <div className={`mt-auto flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <span className="mr-2">👥</span>
                                <span>{project.users.length} Collaborators</span>
                            </div>
                        </div>
                    ))}
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                        <div className={`p-8 rounded-xl shadow-xl w-full max-w-md mx-4 transform transition-all ${
                            isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                Create New Project
                            </h2>
                            <form onSubmit={createProject} className="space-y-6">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        Project Name
                                    </label>
                                    <input
                                        type="text"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                        }`}
                                        placeholder="Enter project name"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className={`px-6 py-2 rounded-lg transition-colors duration-300 ${
                                            isDarkMode 
                                                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                        }`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
                                    >
                                        Create Project
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Home;