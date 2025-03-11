/* eslint-disable @typescript-eslint/no-explicit-any */
import { Medicine } from './medicine.model';
import { TMedicine } from './medicine.types';

// Create Medicine
const createMedicine = async (payload: TMedicine) => {
  const medicine = await Medicine.create(payload);
  return medicine;
};

// Get All Medicine
const getAllMedicineFromDB = async (query: Record<string, unknown>) => {
  let searchTerm = '';
  if (query?.searchTerm) {
    searchTerm = query?.searchTerm as string;
  }
  const searchData = [
    { name: { $regex: searchTerm, $options: 'i' } },
    { category: { $regex: searchTerm, $options: 'i' } },
    { symptoms: { $in: [new RegExp(searchTerm, 'i')] } },
  ];

  // Filtering Functionality
  const filter: any = {};
  if (query.category) {
    filter.category = query.category;
  }
  if (query?.minPrice || query.maxPrice) {
    filter.price = {};
    // Min Price
    if (query.minPrice) {
      filter.price.$gte = Number(query?.minPrice);
    }
    // Max Price
    if (query.maxPrice) {
      filter.price.$lte = Number(query?.maxPrice);
    }
  }

  if (query.prescriptionRequired) {
    filter.prescriptionRequired = query.prescriptionRequired === 'true';
  }

  // const finalQuery = { $and: [{ $or: searchData }, filter] };
  const finalQuery = searchTerm ? { $or: searchData, ...filter } : filter;
  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 6;
  const skip = (page - 1) * limit;

  const [medicines, total] = await Promise.all([
    Medicine.find(finalQuery).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Medicine.countDocuments(finalQuery),
  ]);

  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: medicines,
  };
};

// Get Single Medicine
const getSingleMedicineFromDB = async (id: string) => {
  const medicine = await Medicine.findById(id);
  return medicine;
};

// Get Category
const getCategoryFromDB = async () => {
  const medicine = await Medicine.distinct('category');
  return medicine;
};

// Update Single Medicine
const updateSingleMedicineFromDB = async (
  payload: Partial<TMedicine>,
  id: string,
) => {
  // Update Medicine
  const medicine = await Medicine.findByIdAndUpdate(id, payload, { new: true });
  return medicine;
};

// Delete Single Medicine
const deleteSingleMedicineFromDB = async (id: string) => {
  // Delete Medicine
  const medicine = await Medicine.findByIdAndDelete(id);
  return medicine;
};
export const MedicineServices = {
  createMedicine,
  getAllMedicineFromDB,
  getSingleMedicineFromDB,
  updateSingleMedicineFromDB,
  deleteSingleMedicineFromDB,
  getCategoryFromDB,
};
