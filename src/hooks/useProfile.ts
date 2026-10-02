import { useState, useEffect, useRef, useCallback } from 'react';
import { Profile, defaultProfile, JobExperience, defaultJobExperience } from '../types/profile';
import { loadProfile, saveProfile, clearProfile as storageClearProfile } from '../storage/profileStorage';

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [isLoaded, setIsLoaded] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Load from storage on mount
  useEffect(() => {
    let mounted = true;
    loadProfile().then((data) => {
      if (mounted) {
        setProfile(data);
        setIsLoaded(true);
      }
    });
    return () => {
      mounted = false;
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Internal helper to trigger debounced save
  const triggerSave = useCallback((updated: Profile) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      saveProfile(updated);
    }, 400);
  }, []);

  // Update a top-level section partially
  const updateSection = useCallback(
    <K extends keyof Profile>(section: K, values: Partial<Profile[K]>) => {
      setProfile((prev) => {
        const currentSection = prev[section];
        const updatedSection =
          typeof currentSection === 'object' && !Array.isArray(currentSection)
            ? { ...currentSection, ...values }
            : values;
        const updated = {
          ...prev,
          [section]: updatedSection,
        } as Profile;
        triggerSave(updated);
        return updated;
      });
    },
    [triggerSave]
  );

  // Update a single nested field
  const updateField = useCallback(
    <K extends keyof Profile, F extends keyof Profile[K]>(
      section: K,
      field: F,
      value: any
    ) => {
      setProfile((prev) => {
        const currentSection = prev[section] as Record<string, any>;
        const updatedSection = {
          ...currentSection,
          [field as string]: value,
        };
        const updated = {
          ...prev,
          [section]: updatedSection,
        } as Profile;
        triggerSave(updated);
        return updated;
      });
    },
    [triggerSave]
  );

  // Experience management helpers
  const addExperience = useCallback(() => {
    setProfile((prev) => {
      const newExp: JobExperience = {
        id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        organization: '',
        organizationAddress: '',
        designation: '',
        employmentType: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        responsibilities: '',
      };
      const updated = {
        ...prev,
        jobExperiences: [...prev.jobExperiences, newExp],
      };
      triggerSave(updated);
      return updated;
    });
  }, [triggerSave]);

  const removeExperience = useCallback(
    (id: string) => {
      setProfile((prev) => {
        const updated = {
          ...prev,
          jobExperiences: prev.jobExperiences.filter((item) => item.id !== id),
        };
        triggerSave(updated);
        return updated;
      });
    },
    [triggerSave]
  );

  const updateExperience = useCallback(
    (id: string, field: keyof JobExperience, value: any) => {
      setProfile((prev) => {
        const updatedList = prev.jobExperiences.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        );
        const updated = {
          ...prev,
          jobExperiences: updatedList,
        };
        triggerSave(updated);
        return updated;
      });
    },
    [triggerSave]
  );

  // Reset/delete all profile data
  const resetProfile = useCallback(async () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    await storageClearProfile();
    setProfile(defaultProfile);
  }, []);

  // Replace profile completely (for imports)
  const setFullProfile = useCallback(
    async (newProfile: Profile) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      setProfile(newProfile);
      await saveProfile(newProfile);
    },
    []
  );

  return {
    profile,
    isLoaded,
    updateSection,
    updateField,
    addExperience,
    removeExperience,
    updateExperience,
    resetProfile,
    setFullProfile,
  };
}
