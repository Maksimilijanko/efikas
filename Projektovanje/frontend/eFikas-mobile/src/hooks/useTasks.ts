import { useQuery } from '@tanstack/react-query';
import { taskService } from '../api/services/taskService';

export function useTasks(apartmentId?: number) {
    return useQuery({
        queryKey: ['tasks', apartmentId],
        queryFn: () => (apartmentId ? taskService.getTasks(apartmentId) : Promise.resolve([])),
        enabled: !!apartmentId, 
    });
}