// Este archivo es redundante - usar transactionService de api.js
import { transactionService } from './api';

export const getTransactions = transactionService.getAll;
export const getTransaction = transactionService.getById;
export const createTransaction = transactionService.create;
export const updateTransaction = transactionService.update;
export const deleteTransaction = transactionService.delete;

export default transactionService;
