import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { userApi, driveApi, categoryApi } from '../../services/api';
import { HeartHandshake, ArrowLeft, Loader2, AlertCircle, CheckCircle2, PackageCheck } from 'lucide-react';

export default function NewDonationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [drives, setDrives] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [form, setForm] = useState({
    driveId: location.state?.driveId || '',
    categoryId: '',
    itemName: '',
    description: '',
    quantity: 1,
    condition: 'GOOD',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      driveApi.getActiveDrives(),
      categoryApi.getAllCategories()
    ]).then(([drivesRes, categoriesRes]) => {
      setDrives(drivesRes.data);
      setCategories(categoriesRes.data);
      if (!form.driveId && drivesRes.data.length > 0) {
        setForm(prev => ({ ...prev, driveId: drivesRes.data[0].id }));
      }
      if (categoriesRes.data.length > 0) {
        setForm(prev => ({ ...prev, categoryId: categoriesRes.data[0].id }));
      }
    }).catch(err => {
      setApiError('Failed to load drive and category options.');
    }).finally(() => setLoadingData(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'quantity' ? (value === '' ? '' : parseInt(value, 10)) : value
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!form.driveId) newErrors.driveId = 'Please select a donation drive.';
    if (!form.categoryId) newErrors.categoryId = 'Please select an item category.';
    if (!form.itemName || !form.itemName.trim()) newErrors.itemName = 'Item name is required.';
    if (!form.quantity || form.quantity <= 0) newErrors.quantity = 'Quantity must be greater than zero.';
    if (!['NEW', 'GOOD', 'WORN'].includes(form.condition)) newErrors.condition = 'Invalid condition selected.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setApiError('');

    try {
      const payload = {
        driveId: Number(form.driveId),
        categoryId: Number(form.categoryId),
        itemName: form.itemName.trim(),
        description: form.description ? form.description.trim() : '',
        quantity: Number(form.quantity),
        condition: form.condition,
      };

      const res = await userApi.createDonation(payload);
      navigate(`/user/donations/${res.data.id}`, { state: { created: true } });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to submit donation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <Link
          to="/user/donations"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to donations</span>
        </Link>
        <span className="block text-xs font-bold uppercase tracking-widest text-brand-600">Give Back</span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 mt-1">
          Record a New Donation
        </h1>
        <p className="mt-2 text-sm text-neutral-500 font-medium">
          Fill in item details to register your donation. A coordinator will verify and collect the items.
        </p>
      </div>

      {apiError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-10 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Drive & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-wide">
                Target Donation Drive <span className="text-rose-500">*</span>
              </label>
              <select
                name="driveId"
                value={form.driveId}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${errors.driveId ? 'border-rose-300 bg-rose-50' : 'border-neutral-200 bg-neutral-50'} text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500`}
              >
                {drives.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.location})
                  </option>
                ))}
              </select>
              {errors.driveId && <p className="mt-1.5 text-xs text-rose-600 font-semibold">{errors.driveId}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-wide">
                Item Category <span className="text-rose-500">*</span>
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${errors.categoryId ? 'border-rose-300 bg-rose-50' : 'border-neutral-200 bg-neutral-50'} text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500`}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1.5 text-xs text-rose-600 font-semibold">{errors.categoryId}</p>}
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-wide">
              Item Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="itemName"
              value={form.itemName}
              onChange={handleChange}
              placeholder="e.g. Woolen Winter Overcoats, Science Reference Books"
              className={`w-full px-4 py-3 rounded-xl border ${errors.itemName ? 'border-rose-300 bg-rose-50' : 'border-neutral-200 bg-neutral-50'} text-sm font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500`}
            />
            {errors.itemName && <p className="mt-1.5 text-xs text-rose-600 font-semibold">{errors.itemName}</p>}
          </div>

          {/* Quantity & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-wide">
                Quantity (Units/Pieces) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={form.quantity}
                onChange={handleChange}
                placeholder="1"
                className={`w-full px-4 py-3 rounded-xl border ${errors.quantity ? 'border-rose-300 bg-rose-50' : 'border-neutral-200 bg-neutral-50'} text-sm font-black text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500`}
              />
              {errors.quantity && <p className="mt-1.5 text-xs text-rose-600 font-semibold">{errors.quantity}</p>}
              <p className="mt-1 text-[11px] text-neutral-400 font-medium">Must be greater than zero.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-wide">
                Item Condition <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['NEW', 'GOOD', 'WORN'].map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => {
                      setForm(prev => ({ ...prev, condition: cond }));
                      setErrors(prev => ({ ...prev, condition: '' }));
                    }}
                    className={`py-3 rounded-xl text-xs font-extrabold border transition-all ${
                      form.condition === cond
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
              {errors.condition && <p className="mt-1.5 text-xs text-rose-600 font-semibold">{errors.condition}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-wide">
              Description / Notes (Optional)
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Provide details such as sizes, topics, editions, or packing information..."
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            <Link
              to="/user/donations"
              className="px-5 py-3 text-xs font-bold text-neutral-500 hover:text-neutral-900"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 disabled:opacity-60 transition-all shadow-md active:scale-95"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Donation...</span>
                </>
              ) : (
                <>
                  <PackageCheck className="w-4 h-4" />
                  <span>Submit Donation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
