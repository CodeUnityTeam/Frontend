export type ExperienceItem = {
  id?: string;
  company: string;
  from: string;
  to?: string;
  startDate?: string;
  endDate?: string | null;
  position: string;
  responsibilities?: string;
};

export type Profile = {
  rating?: number;
  avatar?: string;
  status?: string;
  name?: string;
  role?: string;
  location?: string;
};

export type AccountProfileProps = {
  profile?: Profile;
  skills?: string[];
  qualities?: string[];
  about?: string;
  experience?: ExperienceItem[];
};
