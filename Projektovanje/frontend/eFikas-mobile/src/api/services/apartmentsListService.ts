import { ApartmentCurrentInfo } from "@/src/types/types";

export const apartmentsListService = {
    getApartments: async (): Promise<ApartmentCurrentInfo[]> => {
        return [
            {
                id: 1,
                name: 'Modern Loft',
                address: 'Ulica kralja Petra I Karadjordjevica 73',
                imageUrl: 'https://picsum.photos/id/1018/600/400',
                status: true,
                statusUntil: '11.02.2026.',
                nextGuestsDate: '01.03.2026.'
            },
            {
                id: 2,
                name: 'Cozy Studio',
                address: 'Ulica Veselina Maslese 18',
                imageUrl: 'https://picsum.photos/id/1025/600/400',
                status: false,
                statusUntil: null,
                nextGuestsDate: '20.01.2026.'
            },
            {
                id: 3,
                name: 'Family Apartment',
                address: 'Ulica Aleja Svetog Save 5',
                imageUrl: 'https://picsum.photos/id/1035/600/400',
                status: true,
                statusUntil: '12.01.2026.',
                nextGuestsDate: '25.01.2026.'
            }
        ];

    }
};
