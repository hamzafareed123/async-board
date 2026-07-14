import React from "react";
import logo from "/logo.png";


interface LogoProps{
    size?:number
}
const Logo: React.FC<LogoProps> = ({size}) => {
  return (
    <div>
      <img src={logo} alt="Logo"  width={size}/>
    </div>
  );
};

export default Logo;