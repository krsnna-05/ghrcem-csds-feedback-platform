type FormInfoProps = {
  Name: string;
  Type: string;
  Branch: string;
};

const FormInfo = ({ Name, Type, Branch }: FormInfoProps) => {
  return (
    <div className=" flex justify-around border-b border-muted-foreground/50 mx-auto w-[98%]">
      <img src="/logo.png" className="m-2  " />
      <div className=" text-center flex flex-col items-center justify-center">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2">
          {Name}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          <span className="font-medium">Type:</span> {Type}
        </p>
        <p className="text-sm sm:text-base text-muted-foreground">
          <span className="font-medium">Branch:</span> {Branch}
        </p>
      </div>
    </div>
  );
};

export default FormInfo;
