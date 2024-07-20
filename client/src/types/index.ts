export type Relation = {
  id: string;
  label: string;
  value: string;
};

export type People = {
  image?: string;
  id: string;
  created: Date;
  updated: Date;
  name: string;
  date_of_birth: Date;
  salutation: string;
  relation: string;
  additional_info?: string;
  expand?: {
    relation: string[];
  };
  gender: string;
  meta_data?: any;
  email?: string;
  mobile?: string;
  company?: string;
  social_link?: string;
};

export type Event = {
  id: string;
  collectionId: string;
  collectionName: string;
  created: Date;
  updated: Date;
  name: string;
  date: Date;
  expand: {
    people: People;
  };
  person: string[];
  every_year: boolean;
};

// Define the type for your message data
export interface IMessage {
  id: string;
  image: string;
  message: string;
  created: string;
  receipt: string;
  sent: boolean;
  template: string;
  expand?: { receipt: IReceipt; template: ITemplate };
}

// Define the type for receipt data
export interface IReceipt {
  id: string;
  name: string;
  salutation: string;
  image: string;
}

// Define the type for template data
export interface ITemplate {
  id: string;
  message: string;
  image: string;
}

// Define the type for the chat component props
export interface ChatProps {
  messages: IMessage[];
}
