import { ObjectId } from "mongoose"

export type TMedicineReview = {
    userId:ObjectId;
    medicineId: ObjectId;
    review: string;
    ratings: number

}