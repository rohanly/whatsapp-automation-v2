export interface User {
  id: string;
  name: string;
  email: string;
}

export type EventType = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RelationType = {
  id: string;
  name: string;
  chapter: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Relation = {
  id: string;
  personId: string;
  relationTypeId: string;
  createdAt: string;
  updatedAt: string;
  relationType: RelationType;
};

export type Person = {
  id: string;
  name: string;
  dateOfBirth: string;
  salutation: string;
  metaData: any | null;
  additionalInfo: any | null;
  image: string;
  email: string;
  gender: string;
  mobile: string | null;
  extendedFamily: any | null;
  company: any | null;
  socialLink: any | null;
  ex: any | null;
  createdAt: string;
  updatedAt: string;
  relations: Relation[];
};

export type Event = {
  id: string;
  name: string;
  date: string;
  personId: string;
  everyYear: any | null;
  eventTypeId: string;
  messageCount: any | null;
  additionalInfo: any | null;
  templateId: any | null;
  createdAt: string;
  updatedAt: string;
  person: Person;
  eventType: EventType;
};

export type Template = {
  id: string;
  image: string;
  message: string;
  eventTypeId: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
  eventType: EventType;
};

export type Message = {
  id: string;
  image: string;
  message: string;
  eventId: string;
  sent: boolean;
  templateId: string;
  receiptId: string;
  createdAt: string;
  updatedAt: string;
  event: Event;
  receipt: Person;
  template?: Template;
};

export type Pagination = {
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  totalPage: number;
};

export type EventsApiResponse = {
  data: Event[];
  pagination: Pagination;
};

export type TemplatesApiResponse = {
  data: Template[];
  pagination: Pagination;
};
