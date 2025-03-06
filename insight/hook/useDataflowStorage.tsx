import { useState, useCallback, useEffect } from 'react';
import {
    createDataflowConfig,
    getDataflowConfigById,
    updateDataflowConfig,
    deleteDataflowConfig,
    changeDataflowStatus,
    DataflowConfigInput,
    DataflowConfigUpdateInput
} from '@/actions/dataflowConfig';

import { toast } from 'sonner';

const STORAGE_KEY = 'dataflow_drafts';

export function useDataflowStorage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [drafts, setDrafts] = useState<Record<string, DataflowConfigInput>>({});

    // Load drafts from localStorage on mount
    useEffect(() => {
        const savedDrafts = localStorage.getItem(STORAGE_KEY);
        if (savedDrafts) {
            setDrafts(JSON.parse(savedDrafts));
        }
    }, []);

    // Save draft to localStorage
    const saveDraft = useCallback((id: string, data: Partial<DataflowConfigInput>) => {
        setDrafts(prev => {
            const newDrafts = {
                ...prev,
                [id]: { ...prev[id], ...data }
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newDrafts));
            return newDrafts;
        });
    }, []);

    // Remove draft from localStorage
    const removeDraft = useCallback((id: string) => {
        setDrafts(prev => {
            const newDrafts = { ...prev };
            delete newDrafts[id];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newDrafts));
            return newDrafts;
        });
    }, []);

    // Create a new dataflow
    const createDataflow = useCallback(async (data: DataflowConfigInput) => {
        setLoading(true);
        setError(null);
        try {
            const result = await createDataflowConfig(data);
            toast.success("Dataflow created", {
                description: "Your dataflow has been successfully created.",
            });
            // Remove draft after successful creation
            removeDraft(data.id);
            setLoading(false);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create dataflow';
            setError(errorMessage);
            toast.error(errorMessage);
            setLoading(false);
            return null;
        }
    }, [toast, removeDraft]);

    // Get a dataflow by ID
    const getDataflow = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const result = await getDataflowConfigById(id);
            setLoading(false);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dataflow';
            setError(errorMessage);
            toast.error(errorMessage);
            setLoading(false);
            return null;
        }
    }, [toast]);

    // Update a dataflow
    const updateDataflow = useCallback(async (id: string, data: DataflowConfigUpdateInput) => {
        setLoading(true);
        setError(null);
        try {
            const result = await updateDataflowConfig(id, data);
            toast.success("Dataflow updated", {
                description: "Your dataflow has been successfully updated.",
            });
            // Remove draft after successful update
            removeDraft(id);
            setLoading(false);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update dataflow';
            setError(errorMessage);
            toast.error(errorMessage);
            setLoading(false);
            return null;
        }
    }, [toast, removeDraft]);

    // Delete a dataflow
    const deleteDataflow = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await deleteDataflowConfig(id);
            toast.success("Dataflow deleted", {
                description: "Your dataflow has been successfully deleted.",
            });
            // Remove draft after successful deletion
            removeDraft(id);
            setLoading(false);
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete dataflow';
            setError(errorMessage);
            toast.error(errorMessage);
            setLoading(false);
            return false;
        }
    }, [toast, removeDraft]);

    // Change dataflow status
    const changeStatus = useCallback(async (id: string, status: string, updatedBy: string) => {
        setLoading(true);
        setError(null);
        try {
            const result = await changeDataflowStatus(id, status, updatedBy);
            toast.success(`Dataflow status changed to ${status}.`);
            setLoading(false);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to change dataflow status';
            setError(errorMessage);
            toast.error(errorMessage);
            setLoading(false);
            return null;
        }
    }, [toast]);

    return {
        loading,
        error,
        drafts,
        saveDraft,
        removeDraft,

        createDataflow,
        getDataflow,
        updateDataflow,
        deleteDataflow,
        changeStatus,
    };
}