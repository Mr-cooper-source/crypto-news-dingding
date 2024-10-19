export interface FlashResponse {
  status: number;
  message: string;
  data: {
    page: number;
    data: Flash[];
  };
}

export interface Flash {
  id: number;
  title: string;
  content: string;
  pic: string; 
  link: string;
  url: string;
  create_time: string;
}
