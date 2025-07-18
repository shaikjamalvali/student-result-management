import "./App.css";
import { FaSearch, FaFilter } from "react-icons/fa"; // Import icons from react-icons library
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Formtable from "./components/Formtable";
import StudentDetailsPage from "./components/StudentDetailsPage";
import Header from "./components/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import API_URL from './config';

// Configure axios defaults
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true; // Enable credentials
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';

function App() {
  const showSuccessToast = () => {
    toast.success("Data saved successfully", {
      position: toast.POSITION.TOP_CENTER, // You can customize the position
      autoClose: 3000, // Time in milliseconds to auto-close the toast
      hideProgressBar: true, // Hide the progress bar
      closeOnClick: true, // Close the toast when clicked
      draggable: true, // Make the toast draggable
    });
  };

  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();
  const [addSection, setAddSection] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [formData, setFormData] = useState({
    image: "",
    name: "",
    address: "",
    grade: 1,
    class: "",
    motherName: "",
    fatherName: "",
    motherMobile: "",
    fatherMobile: "",
    homeMobile: "",
    isMotherEmployed: false,
    motherEmployerName: "",
    motherJobPosition: "",
    isFatherEmployed: false,
    fatherEmployerName: "",
    fatherJobPosition: "",
    hasSiblings: false,
    sibling1Name: "",
    sibling2Name: "",
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const [formDataEdit, setFormDataEdit] = useState({
    image: "",
    name: "",
    address: "",
    grade: 1,
    class: "",
    homeMobile: "",
    motherName: "",
    fatherName: "",
    motherMobile: "",
    fatherMobile: "",
    isMotherEmployed: false,
    motherEmployerName: "",
    motherJobPosition: "",
    isFatherEmployed: false,
    fatherEmployerName: "",
    fatherJobPosition: "",
    hasSiblings: false,
    sibling1Name: "",
    sibling2Name: "",

    _id: "",
  });

  const [dataList, setDataList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null); // state to keep track of the selected student

  const handleOnChange = (e) => {
    const { value, name, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: newValue,
      };
    });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting form data:', formData);
      const response = await axios.post("/create", formData);
      
      if (response.data.success) {
        setAddSection(false);
        toast.success(response.data.message);
        getFetchData();
        setFormData({
          image: "",
          name: "",
          email: "",
          address: "",
          grade: 1,
          class: "",
          homeMobile: "",
          motherName: "",
          fatherName: "",
          motherMobile: "",
          fatherMobile: "",
          isMotherEmployed: false,
          motherEmployerName: "",
          motherJobPosition: "",
          isFatherEmployed: false,
          fatherEmployerName: "",
          fatherJobPosition: "",
          hasSiblings: false,
          sibling1Name: "",
          sibling2Name: "",
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.response?.data?.message || 'Error creating student');
    }
  };

  // Add these state variables to the `App` component
  const [searchQuery, setSearchQuery] = useState("");

  // Function to handle changes in the search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const getFetchData = async () => {
    const data = await axios.get("/getData");
    if (data.data.success) {
      setDataList(data.data.data);
    }
  };

  //filter
  const [filterByGrade, setFilterByGrade] = useState("");
  const [filterByClass, setFilterByClass] = useState("");

  const handleFilterByGrade = (e) => {
    setFilterByGrade(e.target.value);
  };

  const handleFilterByClass = (e) => {
    setFilterByClass(e.target.value);
  };

  const [showFilterSection, setShowFilterSection] = useState(false);

  const toggleFilterSection = () => {
    setShowFilterSection((prevShowFilterSection) => !prevShowFilterSection);
  };

  useEffect(() => {
    getFetchData();
  }, []);

  const handleDelete = async (student) => {
    // Ask for confirmation before deleting
    if (!window.confirm(`Are you sure you want to delete ${student.name}'s record?`)) {
      return;
    }

    try {
      const response = await axios.delete("/delete/" + student.id);
      if (response.data.success) {
        toast.success(response.data.message);
        await getFetchData(); // Reload the data after successful deletion
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      const errorMessage = error.response?.data?.message || 'Error deleting student. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("/update", formDataEdit);
      if (response.data.success) {
        getFetchData();
        toast.success(response.data.message);
        setEditSection(false);
      }
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error(error.response?.data?.message || 'Error updating student');
    }
  };

  const handleEditOnChange = async (e) => {
    const { value, name, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormDataEdit((prev) => {
      return {
        ...prev,
        [name]: newValue,
      };
    });
  };

  const handleEdit = (el) => {
    setFormDataEdit(el);
    setEditSection(true);
  };

  const handleMoreDetails = (el) => {
    setSelectedStudent(el); // set the selected student in the state
    // Navigate to the StudentDetailsPage with the student data passed in location.state
    navigate("/student-details", { state: { student: el } });
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <ToastContainer 
        position="top-center" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-2xl font-bold text-gray-900'>Student Management</h1>
          <button 
            className='btn btn-add inline-flex items-center'
            onClick={() => setAddSection(true)}
          >
            <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 6v6m0 0v6m0-6h6m-6 0H6'></path>
            </svg>
            Add New Student
          </button>
        </div>
        
        {addSection && (
          <div className='fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto'>
              <Formtable
                handleSubmit={handlesubmit}
                handleOnChange={handleOnChange}
                handleclose={() => setAddSection(false)}
                rest={formData}
              />
            </div>
          </div>
        )}
      <div className='mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
        {/* Search bar */}
        <div className='relative flex-1 max-w-md'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <FaSearch className='text-gray-400 w-4 h-4' />
          </div>
          <input
            type='text'
            value={searchQuery}
            onChange={handleSearch}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
            placeholder='Search by student name...'
          />
        </div>

        {/* Filter section */}
        <div className='relative'>
          <button 
            className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            onClick={toggleFilterSection}
          >
            <FaFilter className='mr-2 h-4 w-4 text-gray-400' />
            Filter
          </button>

          {showFilterSection && (
            <div className='absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10'>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Filter by Grade
                  </label>
                  <input
                    type='text'
                    value={filterByGrade}
                    onChange={handleFilterByGrade}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500'
                    placeholder='Enter grade...'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Filter by Class
                  </label>
                  <input
                    type='text'
                    value={filterByClass}
                    onChange={handleFilterByClass}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500'
                    placeholder='Enter class...'
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

        {editSection && (
          <Formtable
            handleSubmit={handleUpdate}
            handleOnChange={handleEditOnChange}
            handleclose={() => setEditSection(false)}
            rest={formDataEdit}
          />
        )}
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Name
                </th>
                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Address
                </th>
                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Grade
                </th>
                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Class
                </th>
                <th scope='col' className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
            {/* Filtered and sorted student data */}
            {dataList
              .filter(
                (student) =>
                  student.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) &&
                  (filterByGrade === "" ||
                    student.grade.toString() === filterByGrade) &&
                  (filterByClass === "" ||
                    student.class.toLowerCase() === filterByClass.toLowerCase())
              )
              .map((el) => {
                return (
                  <tr key={el._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-10 w-10'>
                          {el.image ? (
                            <img className='h-10 w-10 rounded-full object-cover' src={el.image} alt='' />
                          ) : (
                            <div className='h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center'>
                              <span className='text-gray-500 font-medium'>{el.name?.charAt(0)?.toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900'>{el.name}</div>
                          <div className='text-sm text-gray-500'>{el.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{el.address || 'N/A'}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>
                        Grade {el.grade}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {el.class || 'N/A'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <div className='flex justify-end space-x-2'>
                        <button
                          onClick={() => handleMoreDetails(el)}
                          className='inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleEdit(el)}
                          className='inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(el)}
                          className='inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {dataList.length === 0 && (
        <div className='text-center py-12'>
          <svg className='mx-auto h-12 w-12 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' />
          </svg>
          <h3 className='mt-2 text-sm font-medium text-gray-900'>No students found</h3>
          <p className='mt-1 text-sm text-gray-500'>Get started by creating a new student record.</p>
          <div className='mt-6'>
            <button
              onClick={() => setAddSection(true)}
              className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            >
              <svg className='-ml-1 mr-2 h-5 w-5' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
                <path fillRule='evenodd' d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z' clipRule='evenodd' />
              </svg>
              Add New Student
            </button>
          </div>
        </div>
      )}

      {selectedStudent && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-xl w-full max-w-3xl'>
            <StudentDetailsPage
              student={selectedStudent}
              handleBack={() => setSelectedStudent(null)}
            />
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default App;
