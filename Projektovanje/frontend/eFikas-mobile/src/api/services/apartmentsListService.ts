// services/apartmentsService.ts

export type Apartment = {
    id: number;
    title: string;
    subtitle: string;
    imageUrl: string;
    status: boolean;
    statusUntil: string | null;
    nextGuestsDate: string | null;
};

export const apartmentsListService = {
    getApartments: async (): Promise<Apartment[]> => {
        return [
            {
                id: 1,
                title: 'Modern Loft',
                subtitle: 'Ulica kralja Petra I Karađorđevića 73',
                imageUrl: 'https://picsum.photos/id/1018/600/400',
                status: true,
                statusUntil: '11.02.2026.',
                nextGuestsDate: '01.03.2026.'
            },
            {
                id: 2,
                title: 'Cozy Studio',
                subtitle: 'Ulica Veselina Masleše 18',
                imageUrl: 'https://picsum.photos/id/1025/600/400',
                status: false,
                statusUntil: null,
                nextGuestsDate: '20.01.2026.'
            },
            {
                id: 3,
                title: 'Family Apartment',
                subtitle: 'Ulica Aleja Svetog Save 5',
                imageUrl: 'https://picsum.photos/id/1035/600/400',
                status: true,
                statusUntil: '12.01.2026.',
                nextGuestsDate: '25.01.2026.'
            }
        ];

    }
};
