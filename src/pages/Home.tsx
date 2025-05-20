import { useState } from "react";
import LoginModal from "../components/auth/LoginModal";
import Button from "../components/common/Button";
import ClipitLogo from "/images/ClipitLogo.svg";
import Img1 from "/images/LandingImg1.svg";
import Img2 from "/images/LandingImg2.webp";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="pt-15">
      {/* Section 1 */}
      <section className="w-full h-[480px] bg-[var(--bg-color)]">
        <div className="inner-box flex justify-between">
          {/* Left */}
          <div className="flex flex-col items-start gap-6">
            <img src={ClipitLogo} alt="ClipIt" className="h-12.75 w-auto" />
            <h2>간편한 코드 공유 및 자동 추천 서비스</h2>
            <div>
              <p>필요한 코드를 쉽고 빠르게 찾고, 저장하고, 공유하세요.</p>
              <p>
                ClipIt(클립잇)은 직관적인 검색과 추천 기능을 제공하는 개발자
                맞춤 코드 저장소입니다.
              </p>
            </div>
            <div className="flex flex-row gap-6">
              <Button variant="black" onClick={() => setIsModalOpen(true)}>
                시작하기 →
              </Button>
              <Button variant="outline">문의하기</Button>
            </div>
          </div>
          {/* Right */}
          <div className="">
            <img
              src={Img1}
              alt="미리보기 이미지"
              className="h-[256px] w-auto"
            />
          </div>
        </div>
      </section>
      {/* Section 2 */}
      <section className="w-full h-[480px] bg-[var(--bg-sub-color)]">
        <div className="inner-box flex justify-between">
          {/* Left */}
          <div className="flex flex-col items-start gap-6">
            <h1>원하는 코드를 빠르게 찾으세요</h1>
            <p>
              키워드, 태그, 주제별 필터링을 통해 필요한 코드 조각을 <br />
              직관적으로 검색할 수 있습니다.
            </p>
          </div>
          {/* Right */}
          <div className="h-full flex items-end justify-end">
            <img
              src={Img2}
              alt="미리보기 이미지"
              className="w-[480px] h-auto"
            />
          </div>
        </div>
      </section>
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Home;
