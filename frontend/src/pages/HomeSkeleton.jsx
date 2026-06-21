function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-[#f8f9fc]">

      {/* Navbar */}
      <div className="h-16 bg-white border-b border-slate-200 flex items-center px-8 animate-pulse">
        <div className="h-10 w-10 rounded-xl bg-slate-200"></div>
        <div className="ml-3">
          <div className="h-4 w-24 bg-slate-200 rounded"></div>
          <div className="h-3 w-16 bg-slate-100 rounded mt-2"></div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto p-8">

        {/* Hero */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="h-10 w-72 bg-slate-200 rounded-xl animate-pulse"></div>
            <div className="h-4 w-48 bg-slate-100 rounded mt-3 animate-pulse"></div>
          </div>

          <div className="h-12 w-36 bg-slate-200 rounded-2xl animate-pulse"></div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white rounded-2xl p-5 shadow-sm"
            >
              <div className="h-10 w-10 bg-slate-200 rounded-xl animate-pulse"></div>
              <div className="h-8 w-16 bg-slate-200 rounded mt-4 animate-pulse"></div>
              <div className="h-4 w-24 bg-slate-100 rounded mt-2 animate-pulse"></div>
            </div>
          ))}
        </div>

        <div className="flex flex-col xl:flex-row gap-6">

          {/* Tasks */}
          <div className="flex-1">
            <div className="h-12 w-full bg-slate-200 rounded-2xl mb-5 animate-pulse"></div>

            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-2xl p-5 h-52 shadow-sm border border-slate-100"
                >
                  <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse"></div>
                  <div className="h-5 w-40 bg-slate-200 rounded mt-4 animate-pulse"></div>
                  <div className="h-4 w-full bg-slate-100 rounded mt-3 animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-slate-100 rounded mt-2 animate-pulse"></div>

                  <div className="flex justify-between mt-8">
                    <div className="h-4 w-24 bg-slate-100 rounded animate-pulse"></div>
                    <div className="h-8 w-20 bg-slate-200 rounded-xl animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full xl:w-[320px] space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl p-5 space-y-4 shadow-sm"
              >
                <div className="h-5 w-32 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-slate-100 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-slate-100 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default HomeSkeleton