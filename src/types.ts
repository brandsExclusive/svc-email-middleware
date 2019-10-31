export interface IRecommendation {
  product_code: string;
  name: string;
  link: string;
}

export interface IRecommendations {
  name: string;
  title: string;
  priority: number;
  items: IRecommendation[];
}
