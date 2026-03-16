import React, { useState, useEffect } from 'react';
import { 
  School, 
  Plus, 
  Search, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  MoreVertical,
  Trash2,
  Edit,
  GraduationCap,
  MapPin,
  Users,
  Calendar,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  Link 
} from 'react-router-dom';
import Login from './Login';
import Register from './Register';

// Mock initial data
const INITIAL_SCHOOLS = [
  { id: 1, name: "St. Mary's Academy", location: "New York, USA", students: 1200, type: "Private", established: "1995" },
  { id: 2, name: "Greenwood High", location: "London, UK", students: 850, type: "Public", established: "2002" },
  { id: 3, name: "Silicon Valley Tech", location: "California, USA", students: 2100, type: "International", established: "2010" }
];

const SchoolModal = ({ isOpen, onClose, onSubmit, school, mode }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    students: '',
    type: 'Private',
    established: ''
  });

  useEffect(() => {
    if (school) {
      setFormData(school);
    } else {
      setFormData({
        name: '',
        location: '',
        students: '',
        type: 'Private',
        established: ''
      });
    }
  }, [school, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="modal-container glass-card"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>{mode === 'add' ? 'Add New School' : 'Edit School'}</h2>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.5rem' }}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>School Name</label>
              <input 
                required
                className="input-field" 
                placeholder="e.g. Oxford High School"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Location</label>
              <input 
                required
                className="input-field" 
                placeholder="e.g. London, UK"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Students</label>
                <input 
                  type="number"
                  className="input-field" 
                  placeholder="0"
                  value={formData.students}
                  onChange={(e) => setFormData({...formData, students: e.target.value})}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Type</label>
                <select 
                  className="input-field"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option>Private</option>
                  <option>Public</option>
                  <option>International</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Established Year</label>
              <input 
                className="input-field" 
                placeholder="e.g. 1990"
                value={formData.established}
                onChange={(e) => setFormData({...formData, established: e.target.value})}
              />
            </div>
            
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                {mode === 'add' ? 'Create School' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  const [schools, setSchools] = useState(INITIAL_SCHOOLS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingSchool, setEditingSchool] = useState(null);

  const filteredSchools = (schools || []).filter(school => 
    (school.name ? school.name.toLowerCase() : "").includes(searchQuery.toLowerCase()) ||
    (school.location ? school.location.toLowerCase() : "").includes(searchQuery.toLowerCase())
  );

  const handleAddSchool = (newSchool) => {
    setSchools([...schools, { ...newSchool, id: Date.now() }]);
    setIsModalOpen(false);
  };

  const handleEditSchool = (updatedSchool) => {
    setSchools(schools.map(s => s.id === updatedSchool.id ? updatedSchool : s));
    setIsModalOpen(false);
  };

  const handleDeleteSchool = (id) => {
    if (window.confirm("Are you sure you want to delete this school?")) {
      setSchools(schools.filter(s => s.id !== id));
    }
  };

  const openAddModal = () => {
    setEditingSchool(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const openEditModal = (school) => {
    setEditingSchool(school);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  return (
    <div className="app-container animate-fade-in">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '0.75rem' }}>
            <GraduationCap color="white" size={24} />
          </div>
          <h1 style={{ fontSize: '1.25rem', letterSpacing: '-0.02em' }}>EduAdmin</h1>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '2rem' }}>
          <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--primary)', background: 'rgba(99,102,241,0.1)' }}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
            <School size={20} /> Schools
          </button>
          <button className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
            <Settings size={20} /> Settings
          </button>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <Link to="/" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', color: '#ef4444', textDecoration: 'none' }}>
            <LogOut size={20} /> Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>School Management</h2>
            <p style={{ color: 'var(--text-muted)' }}>Manage and track all registered educational institutions.</p>
          </div>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={20} /> Add New School
          </button>
        </header>

        {/* Stats Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { label: 'Total Schools', value: schools.length, icon: <School size={20} />, color: 'var(--primary)' },
            { label: 'Total Students', value: schools.reduce((acc, s) => acc + (parseInt(s.students) || 0), 0).toLocaleString(), icon: <Users size={20} />, color: 'var(--accent)' },
            { label: 'Active Regions', value: new Set(schools.map(s => s.location).filter(Boolean)).size, icon: <MapPin size={20} />, color: 'var(--success)' },
          ].map((stat, i) => (
            <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ background: `${stat.color}20`, color: stat.color, padding: '0.75rem', borderRadius: '1rem' }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{stat.label}</p>
                <h3 style={{ fontSize: '1.5rem' }}>{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              className="input-field" 
              placeholder="Search schools by name or location..." 
              style={{ paddingLeft: '3rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Schools Grid */}
        <div className="school-grid">
          <AnimatePresence>
            {filteredSchools.map((school) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={school.id} 
                className="glass-card school-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '1rem' }}>
                    <School className="text-primary" size={24} color="var(--primary)" />
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button className="btn btn-ghost" style={{ padding: '0.5rem' }} onClick={() => openEditModal(school)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn btn-ghost btn-danger" style={{ padding: '0.5rem' }} onClick={() => handleDeleteSchool(school.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 style={{ marginBottom: '0.25rem' }}>{school.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <MapPin size={14} /> {school.location}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', margin: '0.5rem 0' }}>
                  <span className="tag">{school.type}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={12} /> Students</div>
                    <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>{school.students}</div>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={12} /> Est.</div>
                    <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>{school.established}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      <SchoolModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        school={editingSchool}
        onSubmit={modalMode === 'add' ? handleAddSchool : handleEditSchool}
      />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
