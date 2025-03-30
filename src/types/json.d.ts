declare module "*.json" {
  const value: { [key: string]: string | { [key: string]: string | { [key: string]: string } } };
  export default value;
} 