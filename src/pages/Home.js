import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Homepage.css';

const Home = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchCriteria, setSearchCriteria] = useState('first_name');
    const [genderFilter, setGenderFilter] = useState('all');

    useEffect(() => {
        axios.get('http://localhost:3030/users')
            .then(res => {
                setData(res.data);
                setFilteredData(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        const filtered = data.filter(user => {
            if (genderFilter === 'male') {
                return user.gender.toLowerCase() === 'male';
            }
            if (genderFilter === 'female') {
                return user.gender.toLowerCase() === 'female';
            }
            if (genderFilter === 'other') {
                return user.gender.toLowerCase() !== 'male' && user.gender.toLowerCase() !== 'female';
            }
            return true; // If 'All' is selected, no gender filter is applied
    
        }).filter(user => user[searchCriteria].toLowerCase().includes(searchTerm.toLowerCase()));
    
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchTerm, searchCriteria, genderFilter, data]);
    

    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const recordsToDisplay = filteredData.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handleRecordsPerPageChange = (e) => {
        setRecordsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    return (
        <div className='container mt-5'>
            <h1>Fetch and Search </h1>
            <div className='button-space'>
                <Link to="/addRecord" className='btn btn-primary'>Create</Link>
            </div>
            <div className="main-container">
                <input
                    type="text"
                    placeholder={`Search by ${searchCriteria}`}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <select value={searchCriteria} onChange={(e) => setSearchCriteria(e.target.value)}>
                    <option value="first_name">Name</option>
                    <option value="gender">Gender</option>
                    <option value="email">Email</option>
                </select>
                <select value={genderFilter} onChange={e => setGenderFilter(e.target.value)}>
                    <option value="all">All</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                <button className='btn btn-primary' onClick={() => setSearchTerm('')}>Reset</button>
                <label style={{marginRight:2, fontWeight:600}} htmlFor="recordsPerPage">Records per Page: </label>
                <select id="recordsPerPage" value={recordsPerPage} onChange={handleRecordsPerPageChange}>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                </select>
            </div>
            {filteredData.length === 0 ? (
                <div style={{width:"100%",height:300,display:'flex',alignItems:'center', justifyContent:'center'}}>
                    <p style={{fontSize:30}}>Record not found</p>
                    </div>
            ) : (
                <div className='table-container' style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recordsToDisplay.map((d, i) => (
                                <tr key={i}>
                                    <td>{d.id}</td>
                                    <td>{d.first_name}</td>
                                    <td>{d.gender}</td>
                                    <td>{d.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="pagination-container">
                <nav>
                    <ul className='pagination'>
                        <li className='page-item'>
                            <button className='page-link' onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Prev</button>
                        </li>
                        {pageNumbers.map(number => (
                            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                <button className='page-link' onClick={() => setCurrentPage(number)}>{number}</button>
                            </li>
                        ))}
                        <li className='page-item'>
                            <button className='page-link' onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
    
}

export default Home;
