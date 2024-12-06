function IconButton({ icon }: { icon: JSX.Element }) {
  return (
    <button
      type="button"
      className="w-8 h-8 flex items-center justify-center rounded-full bg-custom-muted-dark p-1 text-custom-bg shadow-sm hover:bg-custom-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-border"
    >
      {icon}
    </button>
  );
}

export default IconButton;
