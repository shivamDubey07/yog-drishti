import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { YogaClass, ExperienceLevel } from '../../types/database';
import { slugify } from '../../utils/formatters';

export const AdminClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<YogaClass[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [benefitsText, setBenefitsText] = useState('');
  const [level, setLevel] = useState<ExperienceLevel>('All Levels');
  const [schedule, setSchedule] = useState('');
  const [instructor, setInstructor] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const fetchClasses = async () => {
    const { data } = await supabase
      .from('classes')
      .select('*')
      .order('display_order', { ascending: true });
    if (data) setClasses(data);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setShortDesc('');
    setDescription('');
    setBenefitsText('');
    setLevel('All Levels');
    setSchedule('');
    setInstructor('');
    setIsPublished(true);
    setShowForm(false);
  };

  const startEdit = (c: YogaClass) => {
    setEditingId(c.id);
    setTitle(c.title);
    setShortDesc(c.short_description);
    setDescription(c.description);
    setBenefitsText(c.benefits.join('\n'));
    setLevel(c.experience_level);
    setSchedule(c.schedule_text);
    setInstructor(c.instructor_name || '');
    setIsPublished(c.is_published);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const benefitsArray = benefitsText
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      slug: slugify(title),
      short_description: shortDesc.trim(),
      description: description.trim(),
      benefits: benefitsArray,
      experience_level: level,
      schedule_text: schedule.trim(),
      instructor_name: instructor.trim(),
      is_published: isPublished,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      await supabase.from('classes').update(payload).eq('id', editingId);
    } else {
      await supabase.from('classes').insert([{ ...payload, display_order: classes.length + 1 }]);
    }

    resetForm();
    fetchClasses();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this yoga class?')) return;
    await supabase.from('classes').delete().eq('id', id);
    fetchClasses();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest">Class Management</h1>
          <p className="text-xs text-charcoal/60 mt-1">
            Add, edit, or unpublish yoga batches and schedules.
          </p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary py-2.5 px-5 text-xs">
            <Plus className="w-4 h-4" />
            <span>Add New Class</span>
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSave}
          className="bg-white p-6 sm:p-8 rounded-2xl border border-sage/30 shadow-soft space-y-4"
        >
          <div className="flex items-center justify-between border-b border-sage/20 pb-3">
            <h2 className="font-serif text-2xl font-bold text-forest">
              {editingId ? 'Edit Yoga Class' : 'Create Yoga Class'}
            </h2>
            <button type="button" onClick={resetForm} className="text-charcoal/50 hover:text-charcoal">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Class Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Experience Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as ExperienceLevel)}
                className="input-field"
              >
                <option value="All Levels">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Schedule Timings *</label>
              <input
                type="text"
                required
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder="e.g. Mon - Sat | 6:30 AM - 7:30 AM"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Instructor Name</label>
              <input
                type="text"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Short Summary *</label>
            <input
              type="text"
              required
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Full Description *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase mb-1">
              Benefits (One per line)
            </label>
            <textarea
              rows={3}
              value={benefitsText}
              onChange={(e) => setBenefitsText(e.target.value)}
              placeholder="Improves posture&#10;Enhances breath awareness"
              className="input-field"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="class_pub"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            <label htmlFor="class_pub" className="text-xs font-medium">
              Published (Visible on public website)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary py-2.5 px-6 text-xs">
              <Check className="w-4 h-4" />
              <span>Save Class</span>
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary py-2.5 px-6 text-xs">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map((c) => (
          <div
            key={c.id}
            className="bg-white p-6 rounded-2xl border border-sage/30 shadow-soft flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sage-light text-forest">
                  {c.experience_level}
                </span>
                <span
                  className={`text-[11px] font-semibold ${
                    c.is_published ? 'text-emerald-700' : 'text-amber-600'
                  }`}
                >
                  {c.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-forest">{c.title}</h3>
              <p className="text-xs text-charcoal/70 mt-1 mb-3">{c.short_description}</p>
              <p className="text-xs font-medium text-gold">{c.schedule_text}</p>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-sage/20">
              <button
                onClick={() => startEdit(c)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-forest hover:text-gold"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline ml-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};