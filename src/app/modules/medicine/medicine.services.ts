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
  const searchData = {
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { category: { $regex: searchTerm, $options: 'i' } },
      { symptoms: { $in: [new RegExp(searchTerm, 'i')] } },
    ],
  };

  let page = 1;
  let limit = 10;
  let skip = 0;
  if (query?.limit) {
    limit = Number(query?.limit);
  }

  if (query?.page) {
    page = Number(query?.page);
    skip = (page - 1) * limit;
  }

  const [medicines, total] = await Promise.all([
    Medicine.find(searchData).skip(skip).limit(limit),
    Medicine.countDocuments(searchData)
  ])

  return {
    meta:{
      total,
      page,
      limit,
      totalPages: Math.ceil(total/limit)
    },
    data: medicines
  };
};
export const MedicineServices = {
  createMedicine,
  getAllMedicineFromDB,
};
