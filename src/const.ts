import { PromptSet } from "./types/VideoTask";


export const prompt_img = `Bạn cho người mẫu nam hoặc nữ sao cho phù hợp với mô tả sản phẩm đang review sản phẩm này theo mô tả, bạn chọn bối cảnh phòng review cho phù hợp với sản phẩm nhé, người mẫu nhìn thẳng vào camera, hành động của người mẫu với sản phẩm (mặc, sử dụng, cầm, nắm, đứng cạnh, nằm , ngồi ...) bạn chọn sao cho phù hợp với sản phẩm . bạn hãy bóc tách sản phẩm từ ảnh input. bắt buộc phải sử dụng sản phẩm, không dùng hoặc sử dụng bất cứ thứ gì không liên quan đến sản phẩm.
Chú ý tương quan kích thước của sản phẩm và người mẫu phải hợp lý, sản phẩm không được quá to hoặc quá nhỏ so với người mẫu.
Ảnh sinh ra làm sao để khi đưa vào veo3 làm video không bị lỗi PUBLIC_ERROR_PROMINENT_PEOPLE_FILTER_FAILED ,PUBLIC_ERROR_SEXUAL
Quality: ultra-detailed, hyper-realistic, photo-realistic, 8K UHD resolution, cinematic tone, clean composition and no cropping
Negative: no watermark, no text, no duplication, no CGI, no blur, no distortion, no color shift, no overexposed light, no floating objects, no unrealistic pose, no children, no minors, no overly sexy or explicit clothing, no nudity, no suggestive pose, no copyrighted characters, no copyrighted logos, no trademarked content`


export const prompt_video = `Mô tả nhân vật/sản phẩm: Lấy y nguyên nhân vật/sản phẩm trong ảnh đầu vào .

Đừng chèn chữ hay subtitle vào video
Nhân vật phải hoạt động hết khoảng thời gian của video, không bị đứng hình .


Bối cảnh: Trong một studio chuyên về quảng cáo sản phẩm phù hợp với thông tin sản phẩm bên dưới.

Mô tả hành động: Giữ nguyên hình ảnh đầu vào xuyên suốt video, chỉ tạo chuyển động, thay đổi góc máy cho hình ảnh phù hợp với thông tin sản phẩm bên dưới. 

Ánh sáng, góc máy phù hợp với hình ảnh và thông tin sản phẩm bên dưới.

Quality: ultra-detailed, hyper-realistic, photo-realistic, 8K UHD resolution, cinematic tone, clean composition, full-body framing with the entire model visible from head to toe, both feet touching the ground, and no cropping.

Negative: no watermark, no text, no logo, no duplication, no CGI, no blur, no distortion, no color shift, no overexposed light, no floating objects, no cropped frame, no unrealistic pose, no background`



export const DEFAULT_PROMPTS: PromptSet[] = [
  {
    id: "default-mkt",
    name: "Review Có Người Mẫu (AI Tự Random Mặt)",
    isDefault: true,
    prompt_review: `- Các prompt đầu: Giới thiệu sản phẩm. Tạo hook 3s đầu tiên thật hấp dẫn
- Các prompt giữa: Thể hiện tính năng nổi bật của sản phẩm.
- Các prompt cuối: Kêu gọi hành động (CTA).`,
    prompt_image: prompt_img,
    prompt_video: prompt_video,
  },
  {
    id: "default-mkt2",
    name: "Review Theo Nhân Vật Đã Chọn (Giữ Nguyên Mặt)",
    isDefault: true,
    prompt_review: `- Các prompt đầu: Giới thiệu sản phẩm. Tạo hook 3s đầu tiên thật hấp dẫn
- Các prompt giữa: Thể hiện tính năng nổi bật của sản phẩm.
- Các prompt cuối: Kêu gọi hành động (CTA).`,
    prompt_image: `Tôi cung cấp cho bạn 2 bức ảnh tham chiếu: [Ảnh 1] là khuôn mặt người mẫu, [Ảnh 2] là sản phẩm cần review.

YÊU CẦU CỐT LÕI:
Hãy tạo ra một bức ảnh chụp thực tế, trong đó người mẫu (giữ y hệt khuôn mặt, đặc điểm từ Ảnh 1) đang trực tiếp review/tương tác với sản phẩm (bóc tách chính xác từ Ảnh 2). 

CHI TIẾT:
1. Người mẫu: Nhìn thẳng trực diện vào camera, thần thái tự nhiên. BẮT BUỘC trang phục phải cực kỳ kín đáo, lịch sự, phong cách đời thường casual (áo thun, sơ mi dài tay, v.v.). Tuyệt đối không mặc đồ hở hang, không hở ngực/vai, không tạo dáng gợi cảm. Đây là khuôn mặt người bình thường, không phải người nổi tiếng hay chính trị gia.
2. Sản phẩm & Tương tác: Bóc tách đúng thiết kế sản phẩm từ Ảnh 2. Hành động của người mẫu (cầm, nắm, mặc, sử dụng, đứng cạnh) phải logic với loại sản phẩm. Kích thước tương quan giữa người và sản phẩm phải chuẩn xác thực tế (không bị khổng lồ hay tí hon).
3. Bối cảnh: Một phòng studio review hoặc không gian sinh hoạt hiện đại, background được decor phù hợp với ngành hàng của sản phẩm.
4. Chú ý: TUYỆT ĐỐI KHÔNG vẽ thêm bất cứ đồ vật, phụ kiện nào khác không có trong Ảnh 2. Chỉ có người mẫu và sản phẩm.

Quality: ultra-detailed, hyper-realistic, photo-realistic, 8K UHD resolution, cinematic tone, clean composition, studio lighting, authentic skin texture, sharp focus, no cropping.

Negative: nude, sexy clothing, revealing clothes, cleavage, swimsuit, prominent people, public figures, real celebrities, watermark, text, duplication, CGI, blur, distortion, color shift, overexposed light, floating objects, unrealistic pose, children, minors, suggestive pose, copyrighted characters, copyrighted logos, trademarked content.`,
    prompt_video: prompt_video,
  },
  {
    id: "default-mkt3",
    name: "Review Trực Diện - Không có KOC (Focus Sản Phẩm)",
    isDefault: true,
    prompt_review: `- Các prompt đầu: Bắt đầu bằng một câu Hook (thu hút) mạnh mẽ trong 3s đầu tiên, đánh thẳng vào công dụng hoặc điểm ăn tiền nhất của sản phẩm. KHÔNG dùng đại từ nhân xưng rườm rà (ví dụ không dùng: "Xin chào các bạn, hôm nay mình sẽ review..."). Đi thẳng vào khoe sản phẩm.
- Các prompt giữa: Tập trung miêu tả độ sắc nét, thiết kế, chất liệu và tính năng nổi bật. Lời thoại mang âm hưởng quảng cáo (Commercial Showcase), kích thích sự khao khát sở hữu của người xem.
- Các prompt cuối: Kêu gọi hành động (CTA) dứt khoát, thúc đẩy chốt sale (ví dụ: "Chốt đơn ngay góc trái màn hình", "Săn ngay deal hời hôm nay").`,
    prompt_image: `Tôi cung cấp cho bạn 1 bức ảnh tham chiếu: [Ảnh 1] là sản phẩm cần review. ".

YÊU CẦU CỐT LÕI:
Tạo một bức ảnh chụp thực tế theo phong cách quảng cáo thương mại (commercial photography), tập trung 100% vào việc hiển thị sản phẩm, bóc tách chính xác thiết kế và thương hiệu từ Ảnh 1. Tuyệt đối không vẽ thêm người, người mẫu, tay người hay bất kỳ sinh vật sống nào. Chỉ có sản phẩm.

CHI TIẾT:
1. Sản phẩm & Hiển thị: Bóc tách đúng thiết kế, logo (nếu có rõ ràng ở Ảnh 1) của sản phẩm. Bạn hãy sử dụng thông tin từ Tiêu đề và Mô tả để quyết định góc chụp và cách sắp xếp sản phẩm sao cho phù hợp với loại ngành hàng. Ví dụ:
   - Nếu là thực phẩm: Chụp cận cảnh múi, hạt, hoặc cách chế biến hấp dẫn.
   - Nếu là đồ gia dụng: Chụp các tính năng chính, cận cảnh nút bấm hoặc chất liệu.
   - Nếu là thời trang: Chụp chi tiết đường may, chất liệu vải, phụ kiện.
   Hành động (Sản phẩm đang được mở, đang được sử dụng theo mô tả, v.v.) bạn chọn sao cho phù hợp với sản phẩm, không dùng bất cứ thứ gì không liên quan đến sản phẩm.
2. Bối cảnh: Phòng studio review chuyên nghiệp, sạch sẽ, background được decor tối giản nhưng phù hợp với ngành hàng, giúp sản phẩm nổi bật. Không dùng nền trắng trơn, thay vào đó có thể là nền gỗ, đá, hoặc decor đơn giản.
3. Ánh sáng: Chuyên nghiệp, sắc nét, làm nổi bật chất liệu và chi tiết.
4. Chú ý: TUYỆT ĐỐI KHÔNG vẽ thêm đồ vật, phụ kiện, con vật hay bất cứ thứ gì không có trong Ảnh 1.

Quality: ultra-detailed, hyper-realistic, photo-realistic, 8K UHD resolution, cinematic tone, clean composition, studio lighting, authentic texture, sharp focus, no cropping.

Negative: people, faces, human hands, body parts, live animals, watermark, text, duplication, CGI, blur, distortion, color shift, overexposed light, floating objects, unrealistic pose, children, minors, suggestive elements, nude, sexy, copyrighted characters, copyrighted logos, trademarked content.`,
    prompt_video : `Mô tả sản phẩm: Bám sát thiết kế, màu sắc và chi tiết của sản phẩm từ ảnh đầu vào. TUYỆT ĐỐI KHÔNG có sự xuất hiện của con người (không có khuôn mặt, không có bàn tay, không có người mẫu).

Đừng chèn chữ, logo hay subtitle vào video.
Hình ảnh phải có chuyển động mượt mà hết thời lượng video, không bị đứng hình (ví dụ: sản phẩm xoay nhẹ, hiệu ứng ánh sáng lướt qua bề mặt, hoặc các chi tiết môi trường động như khói, nước tùy thuộc vào thông tin sản phẩm).

Bối cảnh: Studio chụp ảnh thương mại (commercial photography) sang trọng hoặc không gian thực tế tôn lên vẻ đẹp sản phẩm.

Mô tả hành động & Camera: Giữ nguyên hình dạng sản phẩm đầu vào xuyên suốt video. Tạo các góc máy chuyển động mang tính điện ảnh (Cinematic) như: Camera panning (quay lướt ngang), Macro shot (cận cảnh chi tiết), hoặc Slow-motion (chuyển động chậm) để phô diễn sự cao cấp của sản phẩm theo thông tin mô tả.

Quality: ultra-detailed, hyper-realistic, photo-realistic, 8K UHD resolution, cinematic tone, clean composition, macro focus, product showcase aesthetic, authentic lighting, sharp focus.

Negative: people, human, face, hands, fingers, characters, watermark, text, logo, duplication, CGI, blur, distortion, color shift, overexposed light, cropped frame, out of focus.`,
  },

];


