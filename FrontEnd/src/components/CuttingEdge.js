import React, {useEffect, useState} from "react";
import toast from "react-hot-toast";

export default function CuttingEdge() {
  const [progress, setProgress] = useState(0);
  const [whitelistContent, setWhitelistContent] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const fetchWhitelistContent = async () => {
    if (!whitelistContent) {
      try {
        const response = await fetch(
            `${process.env.REACT_APP_API_URL}/whitelist`);

        if (response.status === 401) {
          return;
        }

        const content = await response.json();
        setWhitelistContent(content.data);
      } catch (error) {
        toast.error("Error fetching whitelist content.");
        console.error("Error fetching whitelist content:", error);
      }
    }
  };

  useEffect(() => {
    fetchWhitelistContent();
  }, []);

  useEffect(() => {

    if (!whitelistContent?.startedAt || !whitelistContent?.finishedAt) return;

    const start = whitelistContent.startedAt * 1000;
    const end = whitelistContent.finishedAt * 1000;

    const update = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, end - now);
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });

      const totalDuration = end - start;
      const elapsed = now - start;
      const percentage = Math.min(100, Math.max(0, (whitelistContent.sbxAllocated / whitelistContent.sbxTotal) * 100));
      setProgress(percentage);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [whitelistContent]);

  return (
    <section className="xl:mb-[80px] mb-[60px]">
      <div className="container">
        <div className="max-w-[1596px] mx-auto">
          <div className="col-span-12 md:col-span-6 lg:col-span-8">
            <div
                className="relative h-full overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 text-white sm:rounded-[60px] rounded-[20px] mb-12 p-6 lg:p-8 shadow-lg shadow-purple-500/30">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-y-16 -translate-x-16"></div>
                <div
                    className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-y-12 translate-x-12"></div>
              </div>

              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold mb-2 tracking-wide">Phase Ends In:</h2>
                    <p className="text-white/80 text-md font-medium">Founders Circle Presale</p>
                  </div>
                  <div
                      className="bg-white/10 backdrop-blur-sm sm:rounded-[60px] rounded-[20px] px-4 py-2 border border-white/20">
                    <p className="text-xs text-white/70 uppercase tracking-wide mb-1">Progress</p>
                    <p className="text-lg font-bold">{progress.toFixed(1)}% Complete</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 lg:gap-4 text-center mb-6">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                      <div key={unit}
                           className="bg-white/15 backdrop-blur-sm sm:rounded-[60px] rounded-[20px] p-3 lg:p-4 border border-white/20">
                        <div className="text-xl lg:text-3xl font-bold mb-1">
                          {String(value).padStart(2, '0')}
                        </div>
                        <div className="text-xs uppercase font-semibold text-white/90 tracking-wide">
                          {unit}
                        </div>
                      </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="relative w-full h-3 bg-white/20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-1000 rounded-full"
                        style={{width: `${progress}%`}}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white/10 backdrop-blur-sm sm:rounded-[60px] rounded-[20px] p-3 border border-white/20">
                      <p className="text-s, font-medium text-slate-100 uppercase tracking-wider mb-2">Current
                        Phase</p>
                      <p className="text-md font-bold text-purple-100 mb-1">{whitelistContent?.name}</p>
                      <p className="text-lg font-bold text-emerald-100">1 $SBX =
                        ${whitelistContent?.sbxPrice}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm sm:rounded-[60px] rounded-[20px] p-3 border border-white/20">
                      <p className="text-sm font-medium text-slate-100 uppercase tracking-wider mb-2">Next
                        Phase</p>
                      <p className="text-md font-bold text-slate-100 mb-1">{whitelistContent?.nameNext}</p>
                      <p className="text-lg font-bold text-orange-100">1 $SBX =
                        ${whitelistContent?.sbxPriceNext}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
              id="technology"
              className="2xl:px-[84px] xl:px-[50px] px-[26px] lg:py-[52px] py-[45px] sm:rounded-[60px] rounded-[20px] flex flex-col xl:flex-row justify-between items-center gap-[34px]"
              style={{
                background: "linear-gradient(107deg, #7B36B6 0%, #1BA3FF 100%)",
              }}
          >
            <div className="flex-1 xl:max-w-[931px]">
              <h2 className="text-white text-[30px] lg:text-[55px] font-futura-600   leading-[35px] lg:leading-[64px] text-center lg:text-left">
                Cutting-Edge Technology Behind the Superblock Ecosystem!
              </h2>
              <p className="text-white lg:leading-[39.6px] leading-[27.5px] lg:text-[31.383px] text-[23px] font-normal text-center lg:text-left lg:mt-[27px] mt-[23px]">
                The Superblock Ecosystem is powered by advanced technology that
                ensures security, efficiency, and scalability across all its
                services. Our platform is underpinned by a robust blockchain
                infrastructure that supports the tokenization of real-world
                assets and the seamless execution of decentralized finance
                (DeFi) services.
              </p>
            </div>

            <div className="lg:w-[357px] w-full">
              <img
                  src="assets/gifs/gif1.gif"
                  className="lg:w-full w-[292px] mx-auto"
                  alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
