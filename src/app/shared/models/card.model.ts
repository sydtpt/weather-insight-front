export interface Card {
  date: Date;
  title: string;
  subtitle?: string;
  series: {data: number, name: string}[];
  categories: any[];
  colors?: string[];
  chartOptions?: Partial<any>;
}

export let initialCard = {
  date: new Date(),
  title: "",
  subtitle: "",
  categories: [],
  series: [],
  colors: ["#EA3546", "#F9CE1D", "#4154f1"],
};
