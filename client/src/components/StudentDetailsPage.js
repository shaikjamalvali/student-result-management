import React from "react";
import { useSpring, animated } from "react-spring";

const StudentDetailsPage = ({ student, handleBack }) => {
  const animation = useSpring({
    config: {
      tension: 280,
      friction: 20,
    },
    from: {
      opacity: 0,
      transform: "translateY(20px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  });

  return (
    <animated.div style={animation} className='w-full'>
      <div className='bg-white rounded-lg overflow-hidden'>
        {/* Header */}
        <div className='px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center'>
          <h2 className='text-xl font-semibold text-gray-800'>Student Details</h2>
          <button
            onClick={handleBack}
            className='p-2 hover:bg-gray-200 rounded-full transition-colors'
          >
            <svg className='w-5 h-5 text-gray-500' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
              <path d='M6 18L18 6M6 6l12 12'></path>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className='p-6'>
          {/* Profile section */}
          <div className='flex items-center mb-6 pb-6 border-b border-gray-200'>
            <div className='flex-shrink-0'>
              {student.image ? (
                <img className='h-20 w-20 rounded-full object-cover' src={student.image} alt={student.name} />
              ) : (
                <div className='h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center'>
                  <span className='text-2xl font-medium text-primary-600'>{student.name?.charAt(0)?.toUpperCase()}</span>
                </div>
              )}
            </div>
            <div className='ml-4'>
              <h3 className='text-lg font-medium text-gray-900'>{student.name}</h3>
              <p className='text-sm text-gray-500'>Grade {student.grade} | Class {student.class}</p>
              <div className='mt-1 flex items-center text-sm text-gray-500'>
                <svg className='flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
                  <path d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'></path>
                </svg>
                {student.email}
              </div>
            </div>
          </div>

          {/* Details grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Contact Information */}
            <div className='bg-white p-4 rounded-lg border border-gray-200'>
              <h4 className='font-medium text-gray-900 mb-4'>Contact Information</h4>
              <div className='space-y-3'>
                <div>
                  <label className='text-xs font-medium text-gray-500'>Address</label>
                  <p className='mt-1 text-sm text-gray-900'>{student.address || 'Not provided'}</p>
                </div>
                <div>
                  <label className='text-xs font-medium text-gray-500'>Home Mobile</label>
                  <p className='mt-1 text-sm text-gray-900'>{student.homeMobile || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Parent Information */}
            <div className='bg-white p-4 rounded-lg border border-gray-200'>
              <h4 className='font-medium text-gray-900 mb-4'>Parent Information</h4>
              <div className='space-y-4'>
                {/* Mother's Info */}
                <div>
                  <h5 className='text-sm font-medium text-gray-900 mb-2'>Mother's Details</h5>
                  <div className='space-y-2'>
                    <div>
                      <label className='text-xs font-medium text-gray-500'>Name</label>
                      <p className='mt-1 text-sm text-gray-900'>{student.motherName || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className='text-xs font-medium text-gray-500'>Mobile</label>
                      <p className='mt-1 text-sm text-gray-900'>{student.motherMobile || 'Not provided'}</p>
                    </div>
                    {student.isMotherEmployed && (
                      <>
                        <div>
                          <label className='text-xs font-medium text-gray-500'>Employer</label>
                          <p className='mt-1 text-sm text-gray-900'>{student.motherEmployerName}</p>
                        </div>
                        <div>
                          <label className='text-xs font-medium text-gray-500'>Position</label>
                          <p className='mt-1 text-sm text-gray-900'>{student.motherJobPosition}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Father's Info */}
                <div>
                  <h5 className='text-sm font-medium text-gray-900 mb-2'>Father's Details</h5>
                  <div className='space-y-2'>
                    <div>
                      <label className='text-xs font-medium text-gray-500'>Name</label>
                      <p className='mt-1 text-sm text-gray-900'>{student.fatherName || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className='text-xs font-medium text-gray-500'>Mobile</label>
                      <p className='mt-1 text-sm text-gray-900'>{student.fatherMobile || 'Not provided'}</p>
                    </div>
                    {student.isFatherEmployed && (
                      <>
                        <div>
                          <label className='text-xs font-medium text-gray-500'>Employer</label>
                          <p className='mt-1 text-sm text-gray-900'>{student.fatherEmployerName}</p>
                        </div>
                        <div>
                          <label className='text-xs font-medium text-gray-500'>Position</label>
                          <p className='mt-1 text-sm text-gray-900'>{student.fatherJobPosition}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sibling Information */}
            {student.hasSiblings && (
              <div className='bg-white p-4 rounded-lg border border-gray-200 md:col-span-2'>
                <h4 className='font-medium text-gray-900 mb-4'>Sibling Information</h4>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  {student.sibling1Name && (
                    <div>
                      <label className='text-xs font-medium text-gray-500'>Sibling 1</label>
                      <p className='mt-1 text-sm text-gray-900'>{student.sibling1Name}</p>
                    </div>
                  )}
                  {student.sibling2Name && (
                    <div>
                      <label className='text-xs font-medium text-gray-500'>Sibling 2</label>
                      <p className='mt-1 text-sm text-gray-900'>{student.sibling2Name}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default StudentDetailsPage;
