import { CreateReservationPayload, Reservation, UpdateReservationPayload } from "@/src/types/types";
import { API_URLS } from "@/src/util/apiConstants";
import axiosInstance from "../axiosInstance";

export const reservationService = {
	getUserReservations: async (): Promise<Reservation[]> => {
		const res = await axiosInstance.get<Reservation[]>(
			API_URLS.reservations.listUser()
		);
		return res.data;
	},

	getReservations: async (apartmentId: number): Promise<Reservation[]> => {
		const res = await axiosInstance.get<Reservation[]>(
			API_URLS.reservations.listByApartment(apartmentId)
		);
		return res.data;
	},

	getReservation: async (reservationId: number, apartmentId: number): Promise<Reservation> => {
		const res = await axiosInstance.get<Reservation>(
			API_URLS.reservations.getById(reservationId, apartmentId)
		);
		return res.data;
	},

	createReservation: async (
		apartmentId: number,
		payload: CreateReservationPayload,
		documentPicture?: { uri: string; type: string; name: string }
	): Promise<Reservation> => {
		// ALWAYS send as FormData because backend expects multipart/form-data
		const formData = new FormData();
		
		formData.set("reservation", JSON.stringify(payload));
		if (documentPicture) {
			//formData.append("picture", { uri: documentPicture.uri, type: documentPicture.type, name: documentPicture.name, } as any);
			formData.append("picture", { uri: documentPicture.uri, type: documentPicture.type, name: documentPicture.name, } as any);
		}

		// Add picture
		console.log("IN SERVICE - documentPicture:", documentPicture);
		const res = await axiosInstance.post<Reservation>(
			API_URLS.reservations.create(apartmentId),
			formData,
			{
            	headers: {
                	'Content-Type': 'multipart/form-data',
            	},
        	}
		);
		return res.data;
	},

	updateReservation: async (
		reservationId: number,
		payload: UpdateReservationPayload,
		documentPicture?: { uri: string; type: string; name: string }
	): Promise<Reservation> => {
		const formData = new FormData();


		formData.set("reservation", JSON.stringify(payload));
		if (documentPicture) {
			//formData.append("picture", { uri: documentPicture.uri, type: documentPicture.type, name: documentPicture.name, } as any);
			formData.append("picture", { uri: documentPicture.uri, type: documentPicture.type, name: documentPicture.name, } as any);
		}

		const res = await axiosInstance.put<Reservation>(
			API_URLS.reservations.update(reservationId),
			formData,
			{
            	headers: {
                	'Content-Type': 'multipart/form-data',
            	},
        	}
		);
		return res.data;
	},

	deleteReservation: async (reservationId: number): Promise<Reservation> => {
		const res = await axiosInstance.delete<Reservation>(
			API_URLS.reservations.delete(reservationId)
		);
		return res.data;
	},
};