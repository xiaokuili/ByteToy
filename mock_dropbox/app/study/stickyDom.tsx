const SimpleSticky = () => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <header className="sticky top-0 bg-blue-500 text-white p-4 mb-4">
        <h1 className="text-xl font-bold">Sticky Header</h1>
      </header>
      <main>
        {[...Array(20)].map((_, index) => (
          <p key={index} className="mb-4">
            This is paragraph {index + 1}. It provides scrollable content.
          </p>
        ))}
      </main>
    </div>
  );
};

export default SimpleSticky;
