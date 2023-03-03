const loader = ({ src }: any) => {
  return `https://res.cloudinary.com/gladius/image/fetch/${src}`;
};

export default loader;
