import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Code, Briefcase, GraduationCap, Mail, Share2,
  ExternalLink, Github, Linkedin, X, ChevronRight,
  Award, Zap, Moon, Sun, Trash2, Edit3,
  RotateCcw, Shield, LogOut, BookOpen, Wrench, FileText,
  Trophy
} from 'lucide-react';
import ChatBot from './components/ChatBot';

/* ─────────────────────────────────────────
   Admin Security (Environment Variables)
───────────────────────────────────────── */
const ADMIN_PIN = import.meta.env.VITE_ADMIN_PASSWORD || '271828';

/* ─────────────────────────────────────────
   Default Data (localStorage overrides)
───────────────────────────────────────── */
const DEFAULT_DATA = {
  about: "A passionate and driven B.Tech student specializing in Computer Science and Engineering at LPU. With a solid foundation in C++, Java, and Python, I am dedicated to creating innovative, secure, and efficient solutions at the intersection of web development and AI.",
  extra: [
    'Solved 150+ problems on LeetCode focusing on DSA.',
    'Participated in 3+ college cultural events and fests.',
    'Volunteered in 2+ social initiatives and community activities.',
  ],
  education: [
    { school: 'Lovely Professional University', degree: 'B.Tech - Computer Science and Engineering', duration: 'Since Aug 2023', score: 'CGPA: 6.6' },
    { school: 'Guru Teg Bahadur Public School', degree: 'Intermediate', duration: 'Apr 2022 - Mar 2023', score: '69%' },
    { school: 'Assembly of God Church School', degree: 'Matriculation', duration: 'Apr 2020 - Mar 2021', score: '79%' },
  ],
  internships: [
    {
      company: 'AptiDude', role: 'Software Developer Intern', duration: 'May 2025 - Jul 2025',
      points: [
        'Developed core modules for an aptitude platform supporting 500+ questions and 100+ test cases.',
        'Engineered backend evaluation logic reducing manual checking effort by ~70% with automated scoring.',
        'Improved system stability by resolving 10+ bugs and optimizing performance.',
        'Supported deployment enabling smooth hosting for 200+ simultaneous users.',
      ],
    },
  ],
  projects: [
    { id: 'p1', title: 'BloomCare - Smart Healthcare Portal', duration: 'May-Jul 2025', tech: 'Angular, Node.js, Express, MongoDB, JWT', points: ['Built a secure healthcare platform managing 1,000+ patient records with encrypted storage.', 'Developed multi-role ecosystem for patients, doctors, labs, hospitals with RBAC.', 'Integrated CURA chatbot resolving 100+ healthcare queries.', 'Enabled location-based service discovery via 4 REST APIs.'], live: 'https://bloom-bjhrp2ikp-shivani-singhs-projects-0148909b.vercel.app/home', github: '' },
    { id: 'p2', title: 'EG-Marketplace - Multi-Vendor System', duration: 'May-Jul 2025', tech: 'React.js, Node.js, Express, MongoDB, JWT', points: ['Created a multi-tenant marketplace supporting Admin, Vendor, and Buyer roles.', 'Designed vendor onboarding and financial workflows handling 100+ products.', 'Implemented real-time notifications and optimized analytics dashboards.', 'Achieved ~40% improvement in user engagement through performance tuning.'], live: '', github: 'https://github.com/ShivaniS10' },
    { id: 'p3', title: 'Interactive Webpage - Electricity Usage', duration: 'Apr-May 2024', tech: 'HTML, CSS, JavaScript', points: ['Designed a responsive page focused on sustainability and electricity usage.'], live: 'https://electricusage-beta.vercel.app/', github: '' },
  ],
  certificates: [
    { id: 'c1', title: 'Masters in Generative AI and Generative AI Tools', issuer: 'Udemy', date: 'Aug 2025', link: 'https://drive.google.com/file/d/10x0TA23RnZQlKWYJ4nwZJXr3MNvz2rjp/view' },
    { id: 'c2', title: 'ChatGPT Made Easy: AI Essentials', issuer: 'Udemy', date: 'Aug 2025', link: '' },
    { id: 'c3', title: 'Build Generative AI Apps (No-Code)', issuer: 'Udemy', date: 'Aug 2025', link: '' },
    { id: 'c4', title: 'AI/ML Internship Certificate', issuer: 'InternPe', date: 'Jun 2024', link: 'https://drive.google.com/file/d/16cPkE1kA1bhMJryZD-9RTJi1HyHdzBsm/view' },
  ],
  achievements: [
    'Secured top ranks in internal college coding competitions.',
    'Consistently maintained a high problem-solving streak on LeetCode.',
    'Successfully deployed multiple full-stack applications to production.'
  ],
  skills: {
    languages: [
      { name: 'JavaScript', level: 'Advanced', color: '#d97706' },
      { name: 'C++', level: 'Advanced', color: '#2563eb' },
      { name: 'Python', level: 'Moderate', color: '#7c3aed' },
      { name: 'Java', level: 'Moderate', color: '#dc2626' },
      { name: 'PHP', level: 'Basic', color: '#4f46e5' },
      { name: 'C', level: 'Moderate', color: '#0d9488' },
    ],
    frameworks: [
      { name: 'React.js', level: 'Advanced', color: 'linear-gradient(90deg,#2563eb,#06b6d4)' },
      { name: 'Node.js', level: 'Advanced', color: 'linear-gradient(90deg,#059669,#16a34a)' },
      { name: 'Angular', level: 'Moderate', color: 'linear-gradient(90deg,#dc2626,#b91c1c)' },
      { name: 'Express.js', level: 'Moderate', color: 'linear-gradient(90deg,#4f46e5,#7c3aed)' },
      { name: 'HTML/CSS', level: 'Advanced', color: 'linear-gradient(90deg,#d97706,#ea580c)' },
    ],
    tools: [
      { name: 'MongoDB', level: 'Moderate', color: 'linear-gradient(90deg,#059669,#0891b2)' },
      { name: 'MySQL', level: 'Moderate', color: 'linear-gradient(90deg,#0891b2,#2563eb)' },
      { name: 'Git / GitHub', level: 'Advanced', color: 'linear-gradient(90deg,#7c3aed,#db2777)' },
    ],
    soft: ['Collaboration', 'Communication', 'Teamwork', 'Leadership', 'Critical Thinking'],
  },
  name: 'Shivani Singh',
  title: 'Full Stack Developer and AI Enthusiast',
};

function loadData() {
  try {
    const s = localStorage.getItem('portfolio_data');
    return s ? { ...DEFAULT_DATA, ...JSON.parse(s) } : DEFAULT_DATA;
  } catch { return DEFAULT_DATA; }
}

/* ─────────────────────────────────────────
   Framer variants
───────────────────────────────────────── */
const overlayV = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.22 } }, exit: { opacity: 0, transition: { duration: 0.18 } } };
const boxV = { hidden: { scale: 0.9, opacity: 0, y: 20 }, visible: { scale: 1, opacity: 1, y: 0, transition: { type: 'spring', stiffness: 340, damping: 28 } }, exit: { scale: 0.9, opacity: 0, y: 20, transition: { duration: 0.18 } } };
const panelV = { hidden: { x: '100%' }, visible: { x: 0, transition: { type: 'spring', stiffness: 320, damping: 32 } }, exit: { x: '100%', transition: { duration: 0.25 } } };

/* ─────────────────────────────────────────
   Skill Badge (Categorical Levels)
───────────────────────────────────────── */
function SkillBadge({ name, level, color }) {
  const isGradient = color && color.includes('gradient');
  const baseColor = isGradient ? '#64748b' : color;
  const bg = `${baseColor}15`;
  const border = `${baseColor}35`;
  const textColor = isGradient ? 'var(--text-primary)' : baseColor;

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      className="skill-badge-item"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        padding: '10px 16px',
        borderRadius: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minWidth: 110,
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
      }}
    >
      <span style={{ fontSize: '0.92rem', fontWeight: 800, color: textColor }}>{name}</span>
      <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.75, letterSpacing: '0.03em' }}>{level}</span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Modal Wrapper
───────────────────────────────────────── */
function Modal({ isOpen, onClose, title, wide, children }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    if (isOpen) document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="modal-overlay" variants={overlayV} initial="hidden" animate="visible" exit="exit" onClick={onClose}>
          <motion.div className="modal-box" style={{ maxWidth: wide ? 880 : 820 }} variants={boxV} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={onClose}><X size={17} /></button>
            <div className="modal-header">
              <h2 className="modal-title">{title}</h2>
              <div className="modal-title-bar" />
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────
   OTP Modal
───────────────────────────────────────── */
function OTPModal({ isOpen, onClose, onSuccess }) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const refs = useRef([]);

  const verify = (pin) => {
    if (pin === ADMIN_PIN) { setTimeout(() => { onSuccess(); setDigits(['', '', '', '', '', '']); }, 280); }
    else { setError('Invalid PIN. Try again.'); setShake(true); setTimeout(() => { setDigits(['', '', '', '', '', '']); setShake(false); refs.current[0]?.focus(); }, 600); }
  };

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits]; next[i] = val; setDigits(next); setError('');
    if (val && i < 5) refs.current[i + 1]?.focus();
    if (next.every((d) => d !== '')) verify(next.join(''));
  };
  const handleKeyDown = (i, e) => { if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus(); };
  const handleClose = () => { setDigits(['', '', '', '', '', '']); setError(''); onClose(); };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="modal-overlay" style={{ zIndex: 250 }} variants={overlayV} initial="hidden" animate="visible" exit="exit" onClick={handleClose}>
          <motion.div className="modal-box otp-modal-box" variants={boxV} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleClose}><X size={17} /></button>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(124,58,237,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)' }}>
                <Shield size={26} />
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 6 }}>Admin Access</h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 500, textAlign: 'center' }}>Enter your 6-digit admin PIN to unlock the full dashboard.</p>
            </div>
            <motion.div className="otp-input-row" animate={shake ? { x: [-8, 8, -6, 6, 0] } : {}} transition={{ duration: 0.4 }}>
              {digits.map((d, i) => (
                <input key={i} ref={(el) => (refs.current[i] = el)} className="otp-digit" type="password" inputMode="numeric" maxLength={1} value={d}
                  onChange={(e) => handleChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)} autoFocus={i === 0} />
              ))}
            </motion.div>
            {error && <p className="otp-error">{error}</p>}
            <button className="btn-primary" onClick={() => { const pin = digits.join(''); if (pin.length < 6) { setError('Enter all 6 digits.'); return; } verify(pin); }}>
              Verify and Enter
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────
   Admin Panel - Full Content Edit
───────────────────────────────────────── */
const TABS = [
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'about', label: 'About', icon: FileText },
  { id: 'skills', label: 'Skills', icon: Zap },
  { id: 'education', label: 'Education', icon: BookOpen },
  { id: 'certificates', label: 'Certs', icon: Award },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'system', label: 'System', icon: Shield },
];

const EMPTY_PROJ = { title: '', duration: '', tech: '', points: '', live: '', github: '' };
const EMPTY_EDU = { school: '', degree: '', duration: '', score: '' };
const EMPTY_CERT = { title: '', issuer: '', date: '', link: '' };

function FInput({ label, value, onChange, placeholder, multi, rows = 3 }) {
  return (
    <div className="admin-form-group">
      <label className="admin-form-label">{label}</label>
      {multi
        ? <textarea className="form-input" placeholder={placeholder} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} style={{ resize: 'vertical', fontSize: '0.85rem' }} />
        : <input className="form-input" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} style={{ fontSize: '0.85rem' }} />}
    </div>
  );
}

function AdminPanel({ isOpen, onClose, data, setData }) {
  const [tab, setTab] = useState('projects');
  const [proj, setProj] = useState(EMPTY_PROJ);
  const [editProjId, setEPId] = useState(null);
  const [edu, setEdu] = useState(EMPTY_EDU);
  const [editEduIdx, setEEI] = useState(null);
  const [cert, setCert] = useState(EMPTY_CERT);
  const [editCertId, setECI] = useState(null);
  const [saved, setSaved] = useState(false);

  const save = (updated) => {
    setData(updated);
    localStorage.setItem('portfolio_data', JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const addProj = () => {
    if (!proj.title.trim()) return;
    const obj = { id: editProjId || 'p' + Date.now(), title: proj.title.trim(), duration: proj.duration.trim(), tech: proj.tech.trim(), points: proj.points.split('\n').map(p => p.trim()).filter(Boolean), live: proj.live.trim(), github: proj.github.trim() };
    save({ ...data, projects: editProjId ? data.projects.map(p => p.id === editProjId ? obj : p) : [...data.projects, obj] });
    setProj(EMPTY_PROJ); setEPId(null);
  };
  const delProj = (id) => { if (window.confirm('Delete this project?')) save({ ...data, projects: data.projects.filter(p => p.id !== id) }); };
  const editProj = (p) => { setEPId(p.id); setProj({ title: p.title, duration: p.duration, tech: p.tech, points: (p.points || []).join('\n'), live: p.live || '', github: p.github || '' }); };

  const addEdu = () => {
    if (!edu.school.trim()) return;
    const list = [...data.education];
    if (editEduIdx !== null) { list[editEduIdx] = { ...edu }; } else { list.push({ ...edu }); }
    save({ ...data, education: list }); setEdu(EMPTY_EDU); setEEI(null);
  };
  const delEdu = (i) => { if (window.confirm('Remove this entry?')) { const l = [...data.education]; l.splice(i, 1); save({ ...data, education: l }); } };
  const editEdu = (e, i) => { setEEI(i); setEdu({ ...e }); };

  const addCert = () => {
    if (!cert.title.trim()) return;
    const obj = { id: editCertId || 'c' + Date.now(), ...cert };
    save({ ...data, certificates: editCertId ? data.certificates.map(c => c.id === editCertId ? obj : c) : [...data.certificates, obj] });
    setCert(EMPTY_CERT); setECI(null);
  };
  const delCert = (id) => { if (window.confirm('Delete?')) save({ ...data, certificates: data.certificates.filter(c => c.id !== id) }); };
  const editCert = (c) => { setECI(c.id); setCert({ title: c.title, issuer: c.issuer, date: c.date, link: c.link || '' }); };

  const setLang = (i, field, val) => {
    const langs = data.skills.languages.map((l, idx) => idx === i ? { ...l, [field]: val } : l);
    save({ ...data, skills: { ...data.skills, languages: langs } });
  };
  const addLang = () => save({ ...data, skills: { ...data.skills, languages: [...data.skills.languages, { name: 'New Skill', level: 'Basic', color: '#8b5cf6' }] } });
  const delLang = (i) => { const l = [...data.skills.languages]; l.splice(i, 1); save({ ...data, skills: { ...data.skills, languages: l } }); };

  const setFw = (i, field, val) => {
    const fws = data.skills.frameworks.map((f, idx) => idx === i ? { ...f, [field]: val } : f);
    save({ ...data, skills: { ...data.skills, frameworks: fws } });
  };
  const addFw = () => save({ ...data, skills: { ...data.skills, frameworks: [...data.skills.frameworks, { name: 'New Framework', level: 'Basic', color: 'linear-gradient(90deg,#2563eb,#7c3aed)' }] } });
  const delFw = (i) => { const f = [...data.skills.frameworks]; f.splice(i, 1); save({ ...data, skills: { ...data.skills, frameworks: f } }); };

  const setSoft = (val) => save({ ...data, skills: { ...data.skills, soft: val.split(',').map(s => s.trim()).filter(Boolean) } });

  const Row = ({ label, onDel, children }) => (
    <div style={{ background: 'rgba(255,255,255,0.3)', border: '1px solid var(--glass-border)', borderRadius: 12, padding: '10px 12px', marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{label}</span>
        <button className="admin-btn-sm del" onClick={onDel}><Trash2 size={12} /></button>
      </div>
      {children}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div style={{ position: 'fixed', inset: 0, zIndex: 290, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div className="admin-panel" variants={panelV} initial="hidden" animate="visible" exit="exit">
            <div className="admin-header">
              <div className="admin-title">
                <Shield size={18} style={{ color: 'var(--accent-purple)' }} />
                Admin Panel
                <span className="admin-badge">Authorized</span>
              </div>
              <button className="btn-icon" onClick={onClose} title="Close"><LogOut size={15} /></button>
            </div>

            <div className="admin-tabs">
              {TABS.map(t => (
                <button key={t.id} className={`admin-tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="admin-body">
              {saved && <p style={{ fontSize: '0.82rem', color: 'var(--accent-green)', fontWeight: 700, textAlign: 'center', background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.2)', borderRadius: 10, padding: '7px' }}>Saved!</p>}

              {tab === 'projects' && (
                <>
                  <div>
                    <div className="admin-section-title">Projects</div>
                    {data.projects.map(p => (
                      <div key={p.id} className="admin-project-row">
                        <span className="admin-project-name">{p.title}</span>
                        <button className="admin-btn-sm edit" onClick={() => editProj(p)}><Edit3 size={12} /></button>
                        <button className="admin-btn-sm del" onClick={() => delProj(p.id)}><Trash2 size={12} /></button>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="admin-section-title">{editProjId ? 'Edit' : 'Add'} Project</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <FInput label="Title *" value={proj.title} onChange={v => setProj({ ...proj, title: v })} placeholder="Project name" />
                      <FInput label="Duration" value={proj.duration} onChange={v => setProj({ ...proj, duration: v })} placeholder="Jan-Mar 2025" />
                      <FInput label="Tech Stack" value={proj.tech} onChange={v => setProj({ ...proj, tech: v })} placeholder="React, Node.js, MongoDB" />
                      <FInput label="Key Points (one per line)" value={proj.points} onChange={v => setProj({ ...proj, points: v })} placeholder={"Built X feature\nImproved Y by 30%"} multi />
                      <FInput label="Live Link" value={proj.live} onChange={v => setProj({ ...proj, live: v })} placeholder="https://..." />
                      <FInput label="GitHub Link" value={proj.github} onChange={v => setProj({ ...proj, github: v })} placeholder="https://github.com/..." />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn-primary" style={{ flex: 1 }} onClick={addProj}>{editProjId ? 'Update' : 'Add Project'}</button>
                        {editProjId && <button className="btn-primary" style={{ flex: '0 0 auto', width: 44, background: 'rgba(148,163,184,0.15)', color: 'var(--text-secondary)' }} onClick={() => { setProj(EMPTY_PROJ); setEPId(null); }}><RotateCcw size={15} /></button>}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {tab === 'about' && (
                <>
                  <div>
                    <div className="admin-section-title">About / Profile</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <FInput label="Display Name" value={data.name} onChange={v => save({ ...data, name: v })} placeholder="Your Name" />
                      <FInput label="Title / Role" value={data.title} onChange={v => save({ ...data, title: v })} placeholder="Full Stack Developer and AI Enthusiast" />
                      <FInput label="About Paragraph" value={data.about} onChange={v => save({ ...data, about: v })} placeholder="Write a short bio..." multi rows={5} />
                    </div>
                  </div>
                  <div>
                    <div className="admin-section-title">Extra Highlights (one per line)</div>
                    <FInput label="" value={data.extra.join('\n')} onChange={v => save({ ...data, extra: v.split('\n').map(s => s.trim()).filter(Boolean) })} placeholder={"Solved 300+ LeetCode problems\nVolunteered in 2+ events"} multi rows={4} />
                  </div>
                  <div>
                    <div className="admin-section-title">Internship</div>
                    {data.internships.map((int, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <FInput label="Role" value={int.role} onChange={v => { const u = [...data.internships]; u[i] = { ...u[i], role: v }; save({ ...data, internships: u }); }} placeholder="Software Developer Intern" />
                        <FInput label="Company" value={int.company} onChange={v => { const u = [...data.internships]; u[i] = { ...u[i], company: v }; save({ ...data, internships: u }); }} placeholder="Company Name" />
                        <FInput label="Duration" value={int.duration} onChange={v => { const u = [...data.internships]; u[i] = { ...u[i], duration: v }; save({ ...data, internships: u }); }} placeholder="May-Jul 2025" />
                        <FInput label="Key Points (one per line)" value={(int.points || []).join('\n')} onChange={v => { const u = [...data.internships]; u[i] = { ...u[i], points: v.split('\n').map(s => s.trim()).filter(Boolean) }; save({ ...data, internships: u }); }} multi />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {tab === 'skills' && (
                <>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <div className="admin-section-title" style={{ marginBottom: 0 }}>Languages</div>
                      <button className="admin-btn-sm edit" onClick={addLang}>+ Add</button>
                    </div>
                    {data.skills.languages.map((l, i) => (
                      <Row key={i} label={`#${i + 1}`} onDel={() => delLang(i)}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <input className="form-input" style={{ fontSize: '0.82rem', flex: '1 1 80px' }} value={l.name} onChange={e => setLang(i, 'name', e.target.value)} placeholder="Name" />
                          <select className="form-input" style={{ fontSize: '0.82rem', width: 100 }} value={l.level} onChange={e => setLang(i, 'level', e.target.value)}>
                            <option value="Basic">Basic</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                          <input className="form-input" style={{ fontSize: '0.82rem', width: 70 }} type="color" value={l.color && l.color.startsWith('#') ? l.color : '#8b5cf6'} onChange={e => setLang(i, 'color', e.target.value)} />
                        </div>
                      </Row>
                    ))}
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <div className="admin-section-title" style={{ marginBottom: 0 }}>Frameworks / Tools</div>
                      <button className="admin-btn-sm edit" onClick={addFw}>+ Add</button>
                    </div>
                    {data.skills.frameworks.map((f, i) => (
                      <Row key={i} label={`#${i + 1}`} onDel={() => delFw(i)}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <input className="form-input" style={{ fontSize: '0.82rem', flex: '1 1 80px' }} value={f.name} onChange={e => setFw(i, 'name', e.target.value)} placeholder="Name" />
                          <select className="form-input" style={{ fontSize: '0.82rem', width: 100 }} value={f.level} onChange={e => setFw(i, 'level', e.target.value)}>
                            <option value="Basic">Basic</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                      </Row>
                    ))}
                  </div>
                  <div>
                    <div className="admin-section-title">Soft Skills (comma-separated)</div>
                    <FInput label="" value={data.skills.soft.join(', ')} onChange={setSoft} placeholder="Teamwork, Leadership, Communication" />
                  </div>
                </>
              )}

              {tab === 'education' && (
                <>
                  <div>
                    <div className="admin-section-title">Education Entries</div>
                    {data.education.map((e, i) => (
                      <div key={i} className="admin-project-row">
                        <span className="admin-project-name">{e.school}</span>
                        <button className="admin-btn-sm edit" onClick={() => editEdu(e, i)}><Edit3 size={12} /></button>
                        <button className="admin-btn-sm del" onClick={() => delEdu(i)}><Trash2 size={12} /></button>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="admin-section-title">{editEduIdx !== null ? 'Edit' : 'Add'} Entry</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <FInput label="School / University *" value={edu.school} onChange={v => setEdu({ ...edu, school: v })} placeholder="LPU" />
                      <FInput label="Degree" value={edu.degree} onChange={v => setEdu({ ...edu, degree: v })} placeholder="B.Tech - CSE" />
                      <FInput label="Duration" value={edu.duration} onChange={v => setEdu({ ...edu, duration: v })} placeholder="Since Aug 2023" />
                      <FInput label="Score / CGPA" value={edu.score} onChange={v => setEdu({ ...edu, score: v })} placeholder="CGPA: 8.5 or 90%" />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn-primary" style={{ flex: 1 }} onClick={addEdu}>{editEduIdx !== null ? 'Update' : 'Add'}</button>
                        {editEduIdx !== null && <button className="btn-primary" style={{ flex: '0 0 auto', width: 44, background: 'rgba(148,163,184,0.15)', color: 'var(--text-secondary)' }} onClick={() => { setEdu(EMPTY_EDU); setEEI(null); }}><RotateCcw size={15} /></button>}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {tab === 'certificates' && (
                <>
                  <div>
                    <div className="admin-section-title">Certificates</div>
                    {data.certificates.map(c => (
                      <div key={c.id} className="admin-project-row">
                        <span className="admin-project-name">{c.title}</span>
                        <button className="admin-btn-sm edit" onClick={() => editCert(c)}><Edit3 size={12} /></button>
                        <button className="admin-btn-sm del" onClick={() => delCert(c.id)}><Trash2 size={12} /></button>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="admin-section-title">{editCertId ? 'Edit' : 'Add'} Certificate</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <FInput label="Title *" value={cert.title} onChange={v => setCert({ ...cert, title: v })} placeholder="Certificate name" />
                      <FInput label="Issuer" value={cert.issuer} onChange={v => setCert({ ...cert, issuer: v })} placeholder="Udemy / Coursera" />
                      <FInput label="Date" value={cert.date} onChange={v => setCert({ ...cert, date: v })} placeholder="Aug 2025" />
                      <FInput label="Drive / Credential Link" value={cert.link} onChange={v => setCert({ ...cert, link: v })} placeholder="https://drive.google.com/..." />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn-primary" style={{ flex: 1 }} onClick={addCert}>{editCertId ? 'Update' : 'Add'}</button>
                        {editCertId && <button className="btn-primary" style={{ flex: '0 0 auto', width: 44, background: 'rgba(148,163,184,0.15)', color: 'var(--text-secondary)' }} onClick={() => { setCert(EMPTY_CERT); setECI(null); }}><RotateCcw size={15} /></button>}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* 🏆 ACHIEVEMENTS TAB RENDER 🏆 */}
              {tab === 'achievements' && (
                <div>
                  <div className="admin-section-title">🌟 Achievements (one per line)</div>
                  <FInput label="" value={(data.achievements || []).join('\n')} onChange={v => save({ ...data, achievements: v.split('\n').map(s => s.trim()).filter(Boolean) })} placeholder={"Hackathon Winner\nPublished Paper"} multi rows={6} />
                </div>
              )}

              {/* 📊 SYSTEM STATS TAB 📊 */}
              {tab === 'system' && (
                <div>
                  <div className="admin-section-title">🖥️ System Information</div>
                  <div style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid var(--glass-border)', borderRadius: 12, padding: '16px', marginBottom: 20 }}>
                     <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
                       Last View Detected:
                     </div>
                     <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
                       {localStorage.getItem('last_site_view') || "Never"}
                     </div>
                     <p style={{ fontSize: '0.75rem', marginTop: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                       * This tracks the last time the site was opened on this device. For global tracking across all users, connect to Vercel KV or a shared database.
                     </p>
                  </div>
                  
                  <div className="admin-section-title">Deployment</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Hosting Provider: <span style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>Vercel</span>
                  </p>
                </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────
   Main App
───────────────────────────────────────── */
export default function App() {
  const [data, setData] = useState(loadData);
  const [activeModal, setModal] = useState(null);
  const [dateTime, setDT] = useState(new Date());
  const [darkMode, setDark] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [otpOpen, setOtp] = useState(false);
  const [adminOpen, setAdmin] = useState(false);

  const clickCount = useRef(0);
  const clickTimer = useRef(null);

  const handleFooterClick = useCallback(() => {
    clickCount.current += 1;
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 1800);
    if (clickCount.current >= 3) { clickCount.current = 0; setOtp(true); }
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    darkMode ? el.classList.add('dark') : el.classList.remove('dark');
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const t = setInterval(() => setDT(new Date()), 1000);
    
    // Visit Tracking (Last Viewed)
    const now = new Date().toLocaleString();
    if (!sessionStorage.getItem('session_tracked')) {
        localStorage.setItem('last_site_view', now);
        sessionStorage.setItem('session_tracked', 'true');
    }
    
    return () => clearInterval(t);
  }, []);

  const fmtTime = (d) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const fmtDate = (d) => d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  const greeting = () => { const h = dateTime.getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; };
  const close = () => setModal(null);

  const NAV = [
    { id: 'about', icon: User, label: 'Summary', color: '#2563eb' },
    { id: 'skills', icon: Zap, label: 'Skills', color: '#7c3aed' },
    { id: 'projects', icon: Briefcase, label: 'Projects', color: '#059669' },
    { id: 'achievements', icon: Trophy, label: 'Achievements', color: '#14b8a6' },
    { id: 'education', icon: GraduationCap, label: 'Academic', color: '#d97706' },
    { id: 'contact', icon: Mail, label: 'Contact', color: '#0891b2' },
    { id: 'socials', icon: Share2, label: 'Socials', color: '#db2777' },
  ];

  return (
    <div className="dashboard-wrap">
      <div className="dashboard-container">
        <div className="top-bar">
          <p className="greeting-text">{greeting()}, {fmtDate(dateTime)}</p>
          <div className="status-bar">
            <button className="btn-icon" onClick={() => setDark(!darkMode)} aria-label="Toggle dark mode">
              {darkMode
                ? <Sun size={17} style={{ color: 'var(--accent-orange)' }} />
                : <Moon size={17} />}
            </button>
            <span className="time-display">{fmtTime(dateTime)}</span>
          </div>
        </div>

        <div className="main-content">
          <div className="center-hub">
            <div className="avatar-wrap">
              <div className="avatar-ring">
                <div className="avatar-ring-inner">
                  <img src="/assets/img/shivani.png" alt={data.name} />
                </div>
              </div>
            </div>

            <div className="hero-text">
              <h1>Hello, {data.name.split(' ')[0]}</h1>
              <p className="hero-title">{data.title}</p>
              <span className="hero-badge">
                <span className="hero-badge-dot" />
                Active Now
              </span>
            </div>

            <div className="icons-container">
              {NAV.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.id} className={`icon-item icon-${i + 1}`}
                    onClick={() => setModal(item.id)}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: 'spring', stiffness: 340, damping: 18 }}
                  >
                    <div className="icon-circle">
                      <Icon size={25} style={{ color: item.color }} />
                    </div>
                    <span className="icon-label">{item.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="hero-trailer" onClick={handleFooterClick}>
          React, Vite, Framer Motion
        </div>
      </div>

      <Modal isOpen={activeModal === 'about'} onClose={close} title="Summary">
        <p className="modal-body-text" style={{ marginBottom: 24 }}>{data.about}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 12 }}>
          {data.extra.map((item, i) => (
            <div key={i} className="extra-item">
              <ChevronRight size={17} style={{ color: 'var(--accent-blue)', flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{item}</span>
            </div>
          ))}
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'skills'} onClose={close} title="Technical Skills" wide>
        <div className="section-label"><Zap size={13} style={{ color: 'var(--accent-orange)' }} />Core Languages</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
          {data.skills.languages.map(s => <SkillBadge key={s.name} {...s} />)}
        </div>

        <div className="section-label" style={{ marginTop: 6 }}><Code size={13} style={{ color: 'var(--accent-blue)' }} />Frameworks and Libraries</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
          {data.skills.frameworks.map(s => <SkillBadge key={s.name} {...s} />)}
        </div>

        <div className="section-label"><Wrench size={13} style={{ color: 'var(--accent-teal)' }} />Tools and Databases</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
          {data.skills.tools.map(s => <SkillBadge key={s.name} {...s} />)}
        </div>

        <div className="section-label"><User size={13} style={{ color: 'var(--accent-pink)' }} />Soft Skills</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {data.skills.soft.map(s => (
            <span key={s} style={{ padding: '6px 15px', borderRadius: 99, background: 'rgba(219,39,119,0.09)', border: '1px solid rgba(219,39,119,0.22)', color: 'var(--accent-pink)', fontSize: '0.85rem', fontWeight: 700 }}>{s}</span>
          ))}
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'projects'} onClose={close} title="Experience and Projects" wide>
        <div className="section-label"><Zap size={13} style={{ color: 'var(--accent-orange)' }} />Internship</div>
        {data.internships.map((int, i) => (
          <div key={i} className="internship-card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              <div>
                <div className="internship-role">{int.role}</div>
                <div className="internship-company">{int.company}</div>
              </div>
              <span className="internship-dur">{int.duration}</span>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(int.points || []).map((p, j) => (
                <li key={j} style={{ display: 'flex', gap: 8, fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.55 }}>
                  <ChevronRight size={15} style={{ color: 'var(--accent-blue)', flexShrink: 0, marginTop: 2 }} />{p}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="section-label"><Code size={13} style={{ color: 'var(--accent-green)' }} />Featured Projects</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {data.projects.map(proj => (
            <div key={proj.id} className="project-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, marginBottom: 5 }}>
                <div className="project-card-title">{proj.title}</div>
                <span className="project-card-duration">{proj.duration}</span>
              </div>
              <div className="project-card-tech">{proj.tech}</div>
              {proj.points?.length > 0 && (
                <ul className="project-card-points" style={{ listStyle: 'none' }}>
                  {proj.points.map((p, j) => (
                    <li key={j}><ChevronRight size={13} style={{ color: 'var(--accent-green)', flexShrink: 0, marginTop: 2 }} />{p}</li>
                  ))}
                </ul>
              )}
              <div className="project-links">
                {proj.live && <a href={proj.live} target="_blank" rel="noreferrer" className="project-link-btn live"><ExternalLink size={12} />Live Demo</a>}
                {proj.github && <a href={proj.github} target="_blank" rel="noreferrer" className="project-link-btn github"><Github size={12} />GitHub</a>}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'education'} onClose={close} title="Academic and Growth">
        <div className="section-label"><GraduationCap size={13} style={{ color: 'var(--accent-orange)' }} />Education</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 28 }}>
          {data.education.map((edu, i) => (
            <div key={i} className="edu-card">
              <div className="edu-icon-box"><GraduationCap size={20} /></div>
              <div>
                <div className="edu-school">{edu.school}</div>
                <div className="edu-degree">{edu.degree}</div>
                <div className="edu-meta">
                  <span className="edu-score">{edu.score}</span>
                  <span style={{ color: 'var(--text-muted)' }}>.</span>
                  <span className="edu-dur">{edu.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="section-label"><Award size={13} style={{ color: 'var(--accent-blue)' }} />Certifications</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 12 }}>
          {data.certificates.map((cert, i) => (
            <div key={cert.id || i} className="cert-card">
              <div className="cert-title">{cert.title}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="cert-meta">{cert.issuer} . {cert.date}</span>
                {cert.link && <a href={cert.link} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)', padding: '3px 5px', borderRadius: 7, transition: 'all 0.2s' }}><ExternalLink size={13} /></a>}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* 🏆 NEW ACHIEVEMENTS MODAL 🏆 */}
      <Modal isOpen={activeModal === 'achievements'} onClose={close} title="Key Achievements">
        {(data.achievements && data.achievements.length > 0) ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 12 }}>
            {data.achievements.map((item, i) => (
              <div key={i} className="extra-item" style={{ background: 'rgba(20, 184, 166, 0.08)', borderColor: 'rgba(20, 184, 166, 0.22)' }}>
                <Trophy size={17} style={{ color: '#14b8a6', flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{item}</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No achievements added yet.</p>
        )}
      </Modal>

      <Modal isOpen={activeModal === 'contact'} onClose={close} title="Connect">
        <p style={{ color: 'var(--text-secondary)', fontWeight: 500, textAlign: 'center', marginBottom: 12, fontSize: '1rem' }}>
          Send me a message for collaborations or opportunities.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <a href="mailto:your-email@example.com" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            padding: '10px 18px', 
            borderRadius: 12, 
            background: 'rgba(124, 58, 237, 0.08)', 
            border: '1px solid rgba(124, 58, 237, 0.22)',
            color: 'var(--accent-purple)',
            fontSize: '0.9rem',
            fontWeight: 700,
            textDecoration: 'none'
          }}>
            <Mail size={18} />
            your-email@example.com
          </a>
        </div>
        <form style={{ display: 'flex', flexDirection: 'column', gap: 13 }} onSubmit={(e) => {
          e.preventDefault();
          const btn = e.target.querySelector('button[type="submit"]');
          btn.textContent = 'Sending...'; btn.disabled = true;
          const params = { name: e.target.name.value, email: e.target.email.value, mobile: e.target.mobile.value, message: e.target.message.value };
          window.emailjs?.send('service_mqmau3b', 'template_6mlxs0g', params)
            .then(() => { alert("Sent! I will get back to you soon."); e.target.reset(); close(); })
            .catch(err => alert('Error: ' + err.text))
            .finally(() => { btn.textContent = 'Send Message'; btn.disabled = false; });
        }}>
          <input name="name" type="text" placeholder="Your Name" required className="form-input" />
          <input name="email" type="email" placeholder="Email Address" required className="form-input" />
          <input name="mobile" type="text" placeholder="Mobile Number" required className="form-input" />
          <textarea name="message" placeholder="Your Message..." rows={4} required className="form-input" style={{ resize: 'vertical' }} />
          <button type="submit" className="btn-primary">Send Message</button>
        </form>
      </Modal>

      <Modal isOpen={activeModal === 'socials'} onClose={close} title="Social Portals">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, padding: '16px 0' }}>
          <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', justifyContent: 'center' }}>
            <motion.a whileHover={{ y: -8, scale: 1.05 }} href="https://www.linkedin.com/in/shivani-singh-a38310209/" target="_blank" rel="noreferrer" className="social-card" style={{ background: 'rgba(0,119,181,0.09)', borderColor: 'rgba(0,119,181,0.22)', color: '#0077b5', minWidth: 130 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <Linkedin size={46} /><span style={{ fontSize: '0.88rem', fontWeight: 700 }}>LinkedIn</span>
              </div>
            </motion.a>
            <motion.a whileHover={{ y: -8, scale: 1.05 }} href="https://github.com/ShivaniS10" target="_blank" rel="noreferrer" className="social-card" style={{ background: 'rgba(15,15,15,0.07)', borderColor: 'rgba(15,15,15,0.15)', color: 'var(--text-primary)', minWidth: 130 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <Github size={46} /><span style={{ fontSize: '0.88rem', fontWeight: 700 }}>GitHub</span>
              </div>
            </motion.a>
          </div>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tap to visit my portals</p>
        </div>
      </Modal>

      <OTPModal isOpen={otpOpen} onClose={() => setOtp(false)} onSuccess={() => { setOtp(false); setAdmin(true); }} />

      <AdminPanel isOpen={adminOpen} onClose={() => setAdmin(false)} data={data} setData={setData} />
      
      <ChatBot />
    </div>
  );
}