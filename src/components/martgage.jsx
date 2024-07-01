import { useState } from "react";
import { z } from "zod";
import { images } from "../constants/images";
import { Circle, PoundSterling } from "lucide-react";

const mortgageSchema = z.object({
  amount: z.number().min(1, { message: "Amount is required" }),
  term: z.number().min(1, { message: "Term is required" }),
  rate: z.number().min(0.1, { message: "Rate is required" }),
  type: z.enum(["Repayment", "Interest Only"], {
    message: "This field is required",
  }),
});

const MortgageCalculator = () => {
  const [formData, setFormData] = useState({
    amount: "",
    term: "",
    rate: "",
    type: "",
  });

  const [errors, setErrors] = useState({});
  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const calculateRepayments = (amount, term, rate, type) => {
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = term * 12;
    let monthlyPayment;

    if (type === "Repayment") {
      monthlyPayment =
        (amount * monthlyRate) / (1 - (1 + monthlyRate) ** -numberOfPayments);
    } else {
      monthlyPayment = amount * monthlyRate;
    }

    const totalRepayment = monthlyPayment * numberOfPayments;
    return {
      monthlyPayment: monthlyPayment.toFixed(2),
      totalRepayment: totalRepayment.toFixed(2),
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = mortgageSchema.safeParse({
      amount: Number(formData.amount),
      term: Number(formData.term),
      rate: Number(formData.rate),
      type: formData.type,
    });

    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors(formattedErrors);
      setResults(null);
    } else {
      const { amount, term, rate, type } = result.data;
      const calculatedResults = calculateRepayments(amount, term, rate, type);
      setResults(calculatedResults);
      setErrors({});
    }
  };

  const handleClearAll = () => {
    setFormData({
      amount: "",
      term: "",
      rate: "",
      type: "",
    });
    setErrors({});
    setResults(null);
  };

  return (
    <div className="flex flex-col items-center justify-center md:min-h-screen bg-slate-300 sm:p-3">
      <div className="sm:rounded-lg lg:rounded-3xl overflow-hidden flex flex-col gap-8  max-w-5xl md:flex-row bg-white w-full">
        <div className="flex flex-col gap-4 p-8 w-full">
          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-end">
            <h1 className="text-xl font-bold">Mortgage Calculator</h1>
            <button
              className="underline cursor-pointer hover:text-slate-500 duration-300 ease-in-out focus-visible:border-2 w-fit"
              onClick={handleClearAll}
            >
              Clear All
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="amount" className="block mb-1 font-medium">
                Mortgage Amount
              </label>
              <div
                className={` overflow-hidden w-full flex group focus-within:border-accent hover:border-slate-800 duration-300 ease-in-out  border ${
                  errors.amount ? "border border-danger" : "border-gray-300"
                } rounded`}
              >
                <span
                  className={` group-focus-within:bg-accent ${
                    errors.amount
                      ? "bg-danger text-slate-100"
                      : "bg-slate-200 text-slate-900"
                  } p-3  `}
                >
                  <PoundSterling aria-label="Pound Sterling" size={16} />
                </span>
                <input
                  type="text"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className={`w-full p-3 group-focus-within:border-none group-focus-within:outline-none text-slate-900 font-semibold`}
                />
              </div>

              {errors.amount && (
                <p className="text-danger text-sm">
                  {errors.amount._errors[0]}
                </p>
              )}
            </div>
            <div className=" flex flex-col gap-4 md:flex-row md:items-center ">
              <div>
                <label htmlFor="term" className="block mb-1 font-medium">
                  Mortgage Term
                </label>
                <div
                  className={` overflow-hidden w-full flex group focus-within:border-accent  hover:border-slate-800 duration-300 ease-in-out  border ${
                    errors.term ? "border border-danger" : "border-gray-300"
                  } rounded`}
                >
                  <input
                    type="text"
                    name="term"
                    id="term"
                    value={formData.term}
                    onChange={handleChange}
                    className={`w-full p-3 group-focus-within:border-none group-focus-within:outline-none text-slate-900 font-semibold`}
                  />
                  <span
                    className={` group-focus-within:bg-accent font-semibold ${
                      errors.term
                        ? "bg-danger text-slate-100"
                        : "bg-slate-200 text-slate-900"
                    } p-3  `}
                  >
                    years
                  </span>
                </div>

                {errors.term && (
                  <p className="text-danger text-sm">
                    {errors.term._errors[0]}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="rate" className="block mb-1 font-medium">
                  Interest Rate
                </label>
                <div
                  className={` overflow-hidden w-full flex group focus-within:border-accent  hover:border-slate-800 duration-300 ease-in-out  border ${
                    errors.rate ? "border border-danger" : "border-gray-300"
                  } rounded`}
                >
                  <input
                    type="text"
                    name="rate"
                    id="rate"
                    value={formData.rate}
                    onChange={handleChange}
                    className={`w-full p-3 group-focus-within:border-none group-focus-within:outline-none text-slate-900 font-semibold`}
                  />
                  <span
                    className={` group-focus-within:bg-accent font-semibold ${
                      errors.rate
                        ? "bg-danger text-slate-100"
                        : "bg-slate-200 text-slate-900"
                    } p-3  `}
                  >
                    % <span className=" sr-only ">percent</span>
                  </span>
                </div>

                {errors.rate && (
                  <p className="text-danger text-sm">
                    {errors.rate._errors[0]}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">Mortgage Type</label>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="repayment"
                  className={`flex items-center font-semibold p-3  peer-focus-within:border-accent duration-300 ease-in-out cursor-pointer focus-within:border-accent hover:border-accent rounded ${
                    formData.type === "Repayment"
                      ? "bg-accent/20 border border-accent"
                      : "border border-slate-500"
                  }`}
                >
                  {formData.type === "Repayment" ? (
                    <div
                      aria-label="radio circle"
                      className=" w-4 h-4 border-2 border-accent grid place-items-center rounded-full mr-2 "
                    >
                      <div
                        aria-label="radio dot"
                        className=" w-2 h-2 rounded-full bg-accent "
                      />
                    </div>
                  ) : (
                    <button
                      aria-label="radio circle"
                      type="button"
                      className=" peer mr-2 focus:outline-none "
                    >
                      <Circle aria-label="radio circle" size={16} />{" "}
                    </button>
                  )}
                  <input
                    type="radio"
                    name="type"
                    id="repayment"
                    value="Repayment"
                    checked={formData.type === "Repayment"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  Repayment
                </label>
                <label
                  htmlFor="interest"
                  className={`flex duration-300 ease-in-out hover:border-accent  peer-focus-within:border-accent cursor-pointer items-center font-semibold p-3 focus-within:border-accent rounded ${
                    formData.type === "Interest Only"
                      ? "bg-accent/20 border border-accent"
                      : "border border-slate-400"
                  }`}
                >
                  {formData.type === "Interest Only" ? (
                    <div
                      aria-label="radio circle"
                      className=" w-4 h-4 border-2 border-accent grid place-items-center rounded-full mr-2 "
                    >
                      <div
                        aria-label="radio dot"
                        className=" w-2 h-2 rounded-full bg-accent "
                      />
                    </div>
                  ) : (
                    <button
                      aria-label="radio circle"
                      type="button"
                      className=" peer mr-2 focus:outline-none "
                    >
                      <Circle aria-label="radio circle" size={16} />
                    </button>
                  )}
                  <input
                    type="radio"
                    name="type"
                    id="interest"
                    value="Interest Only"
                    checked={formData.type === "Interest Only"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  Interest Only
                </label>
              </div>
            </div>
            {errors.type && (
              <p className="text-danger text-sm">{errors.type._errors[0]}</p>
            )}
            <button
              type="submit"
              className="flex items-center gap-3 py-2 bg-accent text-slate-900 font-semibold rounded-full w-full justify-center md:w-fit px-8 hover:opacity-75 duration-300 ease-in-out focus-visible::outline  "
            >
              <img src={images.calcIcon} alt="calculator icon" /> Calculate
              Repayments
            </button>
          </form>
        </div>

        <div className="bg-slate-900 text-slate-400 p-8 w-full md:custom-border">
          {results ? (
            <div className="flex flex-col gap-7">
              <div className="">
                <h2 className="text-lg font-semibold mb-3 text-slate-100">
                  Your results
                </h2>
                <p className="max-w-[50ch]">
                  Your results are shown below based on the information you
                  provided. To adjust the results, edit the form and click
                  “calculate repayments” again.
                </p>
              </div>
              <div className="bg-slate-950 p-5 rounded-lg border-t-2 border-accent">
                <p className="flex flex-col gap-2 border-b border-slate-700 py-2">
                  Your monthly repayments{" "}
                  <span className=" text-xl text-accent pb-3 font-semibold ">
                    £{results.monthlyPayment}
                  </span>
                </p>
                <p className="flex flex-col gap-2 mt-4">
                  Total you&apos;ll repay over the term{" "}
                  <span className=" pb-2 text-lg ">
                    £{results.totalRepayment}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div className=" flex flex-col justify-center gap-4 text-center ">
              <img
                src={images.illustratorEmpty}
                alt="illustrator empty"
                className=" block w-[200px] object-contain mx-auto "
              />
              <h2 className=" text-slate-100 text-xl ">Results shown here</h2>
              <p className=" text-400 max-w-[50ch] ">
                Complete the form and click “calculate repayments” to see what
                your monthly repayments would be.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;
