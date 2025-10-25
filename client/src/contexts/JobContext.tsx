'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job, JobStatus } from '@/lib/stellar';
import { saveJob, getAllJobs, updateJob as updateJobInStorage } from '@/lib/storage';

interface JobContextType {
    jobs: Job[];
    addJob: (job: Job) => Promise<void>;
    updateJobStatus: (jobId: string, status: JobStatus) => Promise<void>;
    getJobById: (jobId: string) => Job | undefined;
    refreshJobs: () => Promise<void>;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export function JobProvider({ children }: { children: React.ReactNode }) {
    const [jobs, setJobs] = useState<Job[]>([]);

    const loadJobs = async () => {
        const loadedJobs = await getAllJobs();
        setJobs(loadedJobs);
    };

    useEffect(() => {
        loadJobs();
        const interval = setInterval(loadJobs, 3000);
        return () => clearInterval(interval);
    }, []);

    const addJob = async (job: Job) => {
        await saveJob(job);
        await loadJobs();
    };

    const updateJobStatus = async (jobId: string, status: JobStatus) => {
        await updateJobInStorage(jobId, { status });
        await loadJobs();
    };

    const refreshJobs = async () => {
        await loadJobs();
    };

    const getJobById = (jobId: string) => {
        return jobs.find((job) => job.id === jobId);
    };

    return (
        <JobContext.Provider value={{ jobs, addJob, updateJobStatus, getJobById, refreshJobs }}>
            {children}
        </JobContext.Provider>
    );
}

export function useJobs() {
    const context = useContext(JobContext);
    if (!context) {
        throw new Error('useJobs must be used within JobProvider');
    }
    return context;
}
