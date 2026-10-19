import { InquiryFormData } from '@/schemas/inquirySchema';

export type ProjectInquiryInput = InquiryFormData;

export interface ProjectInquirySubmissionResult {
  success: boolean;
  message: string;
  inquiryId?: string;
}
