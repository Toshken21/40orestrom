import Form from "./components/form";

export default function Home() {
  
  return (
    <div className="bg-green-50   ">
      <h1 className="text-[30px] font-bold text-center pt-[30px] text-green-800">Fastpriskalkulator</h1>
      <h2 className="text-[24px] font-bold text-center mt-[30px] text-green-800">Er regjeringens forslag for 40 øre/kwh gunstig for deg?</h2>
      <Form />
    </div>
  );
}