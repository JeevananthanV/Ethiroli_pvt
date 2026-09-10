import React, { useEffect, useState } from 'react';
import { getCourses } from '../../../../services/api/courseApi.js';

export default function CourseEditor() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getCourses().catch(() => []);
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading courses...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Course Editor</h2>
          <p className="pageSubtitle">Create/edit courses</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {courses.length === 0 ? (
            <div className="emptyState"><h3>No Courses</h3><p>No courses available.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Title</th><th>Level</th><th>Price</th></tr></thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.title}</td>
                    <td><span className="statusTag active">{course.level || 'All Levels'}</span></td>
                    <td>{course.price ? `$${course.price}` : 'Free'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
