import axios from 'axios';
import API_BASE_URL from '../config';

export const registerUser = (data) => axios.post(`${API_BASE_URL}/auth/register`, data);
export const loginUser = (data) => axios.post(`${API_BASE_URL}/auth/login`, data);
export const forgotPassword = (email) => axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
export const verifyResetCode = (email, code) => axios.post(`${API_BASE_URL}/auth/verify-reset-code`, { email, code });
export const resetPassword = (email, code, newPassword) => axios.post(`${API_BASE_URL}/auth/reset-password`, { email, code, newPassword });
export const fetchDashboard = () => axios.get(`${API_BASE_URL}/user/dashboard`);
export const fetchManageAccount = () => axios.get(`${API_BASE_URL}/user/manage-account`);
export const updateLeverage = (leverage) => axios.put(`${API_BASE_URL}/user/leverage`, { leverage });
export const updateAccountName = (name) => axios.put(`${API_BASE_URL}/user/account-name`, { name });
export const updateMt5Password = (password) => axios.put(`${API_BASE_URL}/user/mt5-password`, { password });
export const requestDeposit = (data) => axios.post(`${API_BASE_URL}/user/deposit`, data);
export const uploadProof = (formData) => axios.post(`${API_BASE_URL}/user/upload-proof`, formData);
export const requestWithdrawal = (data) => axios.post(`${API_BASE_URL}/user/withdraw`, data);
export const requestTransfer = (data) => axios.post(`${API_BASE_URL}/user/transfer`, data);
export const getReferralCode = () => axios.get(`${API_BASE_URL}/user/referral-code`);
export const getNotifications = () => axios.get(`${API_BASE_URL}/user/notifications`);
export const getMt5Details = () => axios.get(`${API_BASE_URL}/user/mt5-details`);
export const setMt5Password = (password) => axios.put(`${API_BASE_URL}/user/mt5-password`, { password });

// Admin endpoints
export const adminGetUsers = () => axios.get(`${API_BASE_URL}/admin/users`);
export const adminDeleteUser = (userId) => axios.delete(`${API_BASE_URL}/admin/users/${userId}`);
export const adminUpdateUser = (userId, data) => axios.put(`${API_BASE_URL}/admin/users/${userId}`, data);
export const adminGetDeposits = () => axios.get(`${API_BASE_URL}/admin/deposits`);
export const adminApproveDeposit = (depositId) => axios.put(`${API_BASE_URL}/admin/deposits/${depositId}/approve`);
export const adminRejectDeposit = (depositId, reason) => axios.put(`${API_BASE_URL}/admin/deposits/${depositId}/reject`, { reason });
export const adminGetWithdrawals = () => axios.get(`${API_BASE_URL}/admin/withdrawals`);
export const adminApproveWithdrawal = (withdrawId) => axios.put(`${API_BASE_URL}/admin/withdrawals/${withdrawId}/approve`);
export const adminRejectWithdrawal = (withdrawId, reason) => axios.put(`${API_BASE_URL}/admin/withdrawals/${withdrawId}/reject`, { reason });
export const adminGetSettings = () => axios.get(`${API_BASE_URL}/admin/settings`);
export const adminUpdateBitcoinAddress = (address) => axios.put(`${API_BASE_URL}/admin/settings/bitcoin`, { address });