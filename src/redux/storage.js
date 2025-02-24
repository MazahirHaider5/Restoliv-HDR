const createNoopStorage = () => ({
    getItem: async () => null,
    setItem: async () => {},
    removeItem: async () => {},
  });
  
  let storage = createNoopStorage(); // Default to noopStorage for SSR
  
  if (typeof window !== "undefined") {
    import("redux-persist/lib/storage").then((module) => {
      storage = module.default; // Use localStorage in the browser
    });
  }
  
  export default storage;
  