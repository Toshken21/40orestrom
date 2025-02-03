"use client";

import { useState } from "react";
import electricityPrices from "../actualElectricityPrices2";
import PriceComparisonChart from "./chart";
console.log(electricityPrices.NO2.length, electricityPrices.NO1.length);
type ElectricityPrices = {
    [key: string]: number[];
  };

  type ResultsType = [number[], number[], number, number, number, number[], number[]];
  
const electricityPriceObject: ElectricityPrices = electricityPrices;


const fixPriceValues = (priceArray: number[], electricityZone: string) => {
    return priceArray.map((arrayItem: number) => {
        if (arrayItem > 0.75) {
            const subsidizedPower = arrayItem - 0.75;
            const newArrayItem = arrayItem - subsidizedPower * 0.9;

            if (electricityZone !== "N04") {
                return newArrayItem + newArrayItem * 0.25;
            } else {
                return newArrayItem;
            }
        } else {
            if (electricityZone !== "N04") {
                return arrayItem + arrayItem * 0.25;
            } else {
                return arrayItem;
            }
        }
    });
};

const fixOriginalPriceValues = (priceArray: number[], electricityZone: string) => {
  return priceArray.map((arrayItem: number) => {
      if (arrayItem > 0.75) {
          
          const newArrayItem = arrayItem;

          if (electricityZone !== "N04") {
              return newArrayItem + newArrayItem * 0.25;
          } else {
              return newArrayItem;
          }
      } else {
          if (electricityZone !== "N04") {
              return arrayItem + arrayItem * 0.25;
          } else {
              return arrayItem;
          }
      }
  });
};

  
  


  const calculateYearlyCost = ({priceArray, hourlyConsumption} : {priceArray: number[]; hourlyConsumption: number }) => {

    const hourCostArray = []

    
        

        for (let x = 0; x < priceArray.length; x++) {
            const cost = priceArray[x] * hourlyConsumption;
            hourCostArray.push(cost);
            
            




    }
    
    const monthCostArray = []
    
    // we get the total cost for each month
    let hourCount = 0;
    const hoursInMonthArray = [744, 696, 744, 720, 744, 720, 744, 744, 720, 744 , 720, 744]
    
    for (let i = 0; i < 12; i++) {
      
      let totalMonthlyCost = 0
      for (let j = hourCount; j < hourCount + hoursInMonthArray[i]; j++) {
        totalMonthlyCost += hourCostArray[j];
      }
      hourCount += hoursInMonthArray[i];
      monthCostArray.push(totalMonthlyCost);

    } 


    const weeklyCostArray = []
    let weeklyHourCount = 0

    for (let b = 0; b < 52; b++) {
      let totalWeeklyCost = 0;
      for (let g = weeklyHourCount; g < weeklyHourCount + 168; g++) {
        totalWeeklyCost += hourCostArray[g];
      }
      weeklyHourCount += 168
      weeklyCostArray.push(totalWeeklyCost);

    }

    
    return [monthCostArray, weeklyCostArray];

  }

  
  // Function using the new fixed price.
  // This currently has priceArray for no reason and needs to get refactored

  const calculateSubsidizedYearlyCost = ({priceArray, hourlyConsumption} : {priceArray: number[]; hourlyConsumption: number }) => {
    
    const hourCostArray = []

    
        

        for (let x = 0; x < priceArray.length; x++) {
            const cost = (0.5 * hourlyConsumption) * 1.15
            hourCostArray.push(cost)
            




    }
    
    const monthCostArray = []
    
    // we get the total cost for each month
    let hourCount = 0;
    const hoursInMonthArray = [744, 696, 744, 720, 744, 720, 744, 744, 720, 744 , 720, 744]
    
    for (let i = 0; i < 12; i++) {
      
      let totalMonthlyCost = 0
      for (let j = hourCount; j < hourCount + hoursInMonthArray[i]; j++) {
        totalMonthlyCost += hourCostArray[j];
      }
      hourCount += hoursInMonthArray[i];
      monthCostArray.push(totalMonthlyCost);
      console.log(totalMonthlyCost);

    }
    
    const weeklyCostArray = []
    let weeklyHourCount = 0

    for (let b = 0; b < 52; b++) {
      let totalWeeklyCost = 0;
      for (let g = weeklyHourCount; g < weeklyHourCount + 168; g++) {
        totalWeeklyCost += hourCostArray[g];
      }
      weeklyHourCount += 168
      weeklyCostArray.push(totalWeeklyCost);

    }

    
    return [monthCostArray, weeklyCostArray];

  }



  const completeFunction = (electricityPriceZone: string, consumption: number ) => {
    const hourlyConsumption = consumption / 24 / 365

    
    // First we fix the values of the price api to remove the electricity subsidy from prices and add mva if the region is not N04
    console.log(electricityPriceObject[electricityPriceZone]);
    const adjustedPriceArray = fixPriceValues(electricityPriceObject[electricityPriceZone], electricityPriceZone);
    const normalPriceArray = fixOriginalPriceValues(electricityPriceObject[electricityPriceZone], electricityPriceZone);

    
    
    // After that we calculate how much does the building consume in a month
    const yearlyConsumption = calculateYearlyCost({priceArray: normalPriceArray, hourlyConsumption: hourlyConsumption, });
    // Then we calculate the subsidized price 
    const yearlySubsidizedConsumption = calculateSubsidizedYearlyCost({priceArray: adjustedPriceArray, hourlyConsumption: hourlyConsumption})

    // Now we create an array where we calculate the price difference between the 40 øre subsidies and the usual price. If the number is positive, subsidized prices are cheaper
    let totalPrice = 0;
    let totalSubsidizedPrice = 0;
    let totalSavedPrize = 0
    const comparizonArray = []
    console.log(yearlySubsidizedConsumption[0].length, "length of yearly subsidized consumption array");
    for ( let k = 0; k < yearlySubsidizedConsumption[0].length; k++) {
      console.log(`Iteration ${k}:`);
      console.log(`yearlyConsumption[0][k]:`, yearlyConsumption[0][k]);
      console.log(`yearlySubsidizedConsumption[0][k]:`, yearlySubsidizedConsumption[0][k]);
      
      // Add validation to ensure we're working with numbers
      if (typeof yearlyConsumption[0][k] === 'number' && !isNaN(yearlyConsumption[0][k]) &&
          typeof yearlySubsidizedConsumption[0][k] === 'number' && !isNaN(yearlySubsidizedConsumption[0][k])) {
          
          totalPrice += yearlyConsumption[0][k];
          totalSubsidizedPrice += yearlySubsidizedConsumption[0][k];
          
          const priceDifference = yearlyConsumption[0][k] - yearlySubsidizedConsumption[0][k];
          totalSavedPrize += priceDifference;
          comparizonArray.push(priceDifference);
      } else {
          console.error(`Invalid values at index ${k}:`, {
              yearlyConsumption: yearlyConsumption[0][k],
              yearlySubsidizedConsumption: yearlySubsidizedConsumption[0][k]
          });
      }
  }
  

    const regularWeekArray = yearlyConsumption[1];
    const subsidizedWeekArray = yearlySubsidizedConsumption[1];
    
    

      
      
    
    console.log("the results array",[
      yearlyConsumption, yearlySubsidizedConsumption, totalPrice, totalSubsidizedPrice, totalSavedPrize, regularWeekArray, subsidizedWeekArray
    ])


      return  [
        yearlyConsumption, yearlySubsidizedConsumption, totalPrice, totalSubsidizedPrice, totalSavedPrize, regularWeekArray, subsidizedWeekArray
      ]
  }


    




  

export default function Form() {
  const [electrityConsumption, setElectricityConsumption] = useState(0);

  const [electricityZone, setElectrictyZone] = useState("NO1");
  const [resultsArray, setResultsArray] = useState<ResultsType>([[], [], 0, 0, 0, [], []]);

  const handleElectricityConsumption = (e: React.ChangeEvent<HTMLInputElement>) => {
    setElectricityConsumption(Number(e.target.value));
  };



  const handleElectricityZone = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setElectrictyZone(e.target.value);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Validate inputs
    if (electrityConsumption <= 0) {
        alert('Byggareal må være større enn 0');
        return;
    }
    
    // Call completeFunction with current state values
    const results = completeFunction(
        electricityZone,
        electrityConsumption,
        
    );
    
    // Update results state
    setResultsArray(results as ResultsType);
  };

  return (
    <div className="bg-green-50 min-h-screen">
      <div className="flex items-center justify-center">
        <div className="flex flex-col space-y-4 mt-[70px]">
          <label className="text-[20px] text-green-800 font-semibold">Årlig strømforbruk(kwh):</label>
          <input 
            className="border border-green-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" 
            onChange={handleElectricityConsumption} 
            type="number" 
          />
          
          
          
          <label className="text-[20px] text-green-800 font-semibold">Strømsone:</label>
          <select 
            className="text-[20px] border border-green-600 rounded px-4 py-2 w-[300px] bg-white focus:outline-none focus:ring-2 focus:ring-green-400" 
            value={electricityZone} 
            onChange={handleElectricityZone}
          >
            <option value={"NO1"}>NO1</option>
            <option value={"NO2"}>NO2</option>
            <option value={"NO3"}>NO3</option>
            <option value={"NO4"}>NO4</option>
            <option value={"NO5"}>NO5</option>
          </select>
          
          <button 
            className="text-[30px] bg-green-600 text-white rounded px-6 py-2 font-medium hover:bg-green-700 transition duration-300"
            onClick={handleSubmit} 
            type="submit"
          >
            Beregn
          </button>
        </div>
      </div>
  
      <div className="resultsHolder">
        <h2 className="mt-[50px] text-[26px] text-green-800 font-bold mb-[50px] text-center">
          
        </h2>
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full px-4 md:w-[80%] md:ml-[10%] pb-[50px] md:pb-[100px]">
        <div className="w-full md:w-[30%] h-48 md:h-56 border border-green-600 bg-green-100 rounded text-center px-4">
          <h2 className="text-[40px] md:text-[55px] font-bold pt-[30px] md:pt-[50px] text-green-700">{resultsArray[2].toFixed(2)}</h2>
          <h3 className="text-[16px] md:text-[20px] text-green-800">Årlig strømpris med strømstøtte</h3>
        </div>
        <div className="w-full md:w-[30%] h-48 md:h-56 border border-green-600 bg-green-100 rounded text-center px-4">
          <h2 className="text-[40px] md:text-[55px] font-bold pt-[30px] md:pt-[50px] text-green-700">{resultsArray[3].toFixed(2)}</h2>
          <h3 className="text-[16px] md:text-[20px] text-green-800">Årlig strømpris med fastpris</h3>
        </div>
        <div className="w-full md:w-[30%] h-48 md:h-56 border border-green-600 bg-green-100 rounded text-center px-4">
          <h2 className="text-[40px] md:text-[55px] font-bold pt-[30px] md:pt-[50px] text-green-700">{resultsArray[4].toFixed(2)}</h2>
          <h3 className="text-[16px] md:text-[20px] text-green-800">Kroner spart med fastpris</h3>
        </div>
      </div>
        <div className="mb-[100px]">
          <PriceComparisonChart

            normalWeeklyPrices={resultsArray[5]}
            subsidizedWeeklyPrices= {resultsArray[6]}
          />
        </div>
        <div className="px-4 md:px-0">
  <h2 className="text-[20px] md:text-[24px] text-center text-green-800 mt-[40px] mb-[40px]">
    Tallene vi brukte i beregningen
  </h2>
  <p className="text-green-700 text-[16px] md:text-[20px] mx-4 md:ml-[10%]">
    Vi hentet strømprisdata fra <a href="https://www.hvakosterstrommen.no/strompris-api">hvakosterstrommen.no</a> og arealforbruket fra <a href="https://www.ssb.no/energi-og-industri/energi/artikler/hva-er-gjennomsnittlig-stromforbruk-i-husholdningene">Statistiske sentralbyrå</a>
  </p>
  <p className="text-green-700 text-[16px] md:text-[20px] mx-4 md:ml-[10%] mt-4">
    Vi har inkludert MVA og den nye nettleiesatsen på 15% i beregningene, men ikke påslag på grunn av manglende informasjon rundt implementeringen av strømforslaget
  </p>
</div>
<div className="bg-emerald-950 mt-[50px] px-4 md:px-0">
  <h2 className="text-center text-[24px] md:text-[30px] pt-[20px]">Hvem er vi?</h2>
  <p className="text-[16px] md:text-[20px] w-[90%] md:w-[80%] mx-auto md:ml-[10%]">
    Vi er en norsk startup som heter PowerSync og vi bygger KI modeller for å gjøre det lettere for bedrifter å forutsi strømforbruk over lengre tid.
  </p>
  <p className="text-[16px] md:text-[20px] w-[90%] md:w-[80%] mx-auto md:ml-[10%] mt-4">
    Hvis du ønsker å kontakte oss, send gjerne mail til <span className="border-b-solid border-b-2 border-white-600">anton.rader@gmail.com</span>
  </p>
  
  <div className="pb-[30px] flex flex-col md:flex-row items-center gap-4 md:gap-0 w-[90%] md:w-[80%] mx-auto md:ml-[10%] pt-[30px]">
    <h2 className="text-[16px] md:text-[20px] mr-0 md:mr-[10px]">Meld deg på vårt nyhetsbrev her:</h2>
    <div className="flex w-full md:w-auto gap-2">
      <input 
        className="flex-1 md:flex-none border-0 border-b-2 border-white-600 bg-transparent focus:outline-none focus:border-white-800 w-full md:w-[200px]"
      />
      <button className="bg-white text-black px-4 py-1 rounded whitespace-nowrap">Send inn</button>
    </div>
  </div>
</div>
      </div>
    </div>
  );
}

