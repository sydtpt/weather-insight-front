export interface Card {
  isDateSerie?: boolean;
  date: Date;
  dislayTemperatureMarkups?: boolean;
  dislayAverageLine?: false,
  title: string;
  subtitle?: string;
  series: {data: number, name: string}[];
  categories: any[];
  colors?: string[];
  chartOptions?: Partial<any>;
}

export let initialCard: Card = {
  date: new Date(),
  isDateSerie: false,
  dislayTemperatureMarkups: false,
  dislayAverageLine: false,
  title: "",
  subtitle: "",
  categories: [],
  series: [],
  colors: ["#EA3546", "#F9CE1D", "#4154f1"],
};
