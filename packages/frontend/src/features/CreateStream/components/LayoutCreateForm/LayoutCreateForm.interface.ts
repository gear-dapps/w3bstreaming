export interface SectionProps {
  title: string;
  children: JSX.Element | JSX.Element[];
}

export interface FormValues {
  title: string;
  description?: string;
  dayDate: Date;
  startTime: string;
  endTime: string;
  imgLink: string;
}
