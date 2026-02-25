type FormInfoProps = {
  Name: string;
  Type: string;
  Branch: string;
};

const FormInfo = ({ Name, Type, Branch }: FormInfoProps) => {
  return (
    <div className=" flex items-center justify-center print:justify-end  border-b border-muted-foreground/50 mx-auto w-[98%]">
      <div className="flex items-center justify-center gap-5">
        <img src="/logo.png" className="m-2 aspect-auto w-40  " />
        <div className=" flex flex-col  ">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2">
            {Name}
          </h2>
          <p className="text-base sm:text-lg md:text-xl font-semibold mb-2">
            {Type === "Theory" ? "THEORY REPORT" : "PRACTICAL REPORT"}
          </p>
          <p className="text-base sm:text-lg md:text-xl font-semibold mb-2">
            {Branch.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormInfo;
