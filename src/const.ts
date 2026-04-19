export const prompt_img = `Bạn cho người mẫu nam hoặc nữ sao cho phù hợp với mô tả sản phẩm đang review sản phẩm này theo mô tả, bạn chọn bối cảnh phòng review cho phù hợp với sản phẩm nhé, người mẫu nhìn thẳng vào camera, hành động của người mẫu với sản phẩm (mặc, sử dụng, cầm, nắm, đứng cạnh, nằm , ngồi ...) bạn chọn sao cho phù hợp với sản phẩm . bạn hãy bóc tách sản phẩm từ ảnh input. bắt buộc phải sử dụng sản phẩm, không dùng hoặc sử dụng bất cứ thứ gì không liên quan đến sản phẩm.
Chú ý tương quan kích thước của sản phẩm và người mẫu phải hợp lý, sản phẩm không được quá to hoặc quá nhỏ so với người mẫu.
Ảnh sinh ra làm sao để khi đưa vào veo3 làm video không bị lỗi PUBLIC_ERROR_PROMINENT_PEOPLE_FILTER_FAILED ,PUBLIC_ERROR_SEXUAL
Quality: ultra-detailed, hyper-realistic, photo-realistic, 8K UHD resolution, cinematic tone, clean composition and no cropping
Negative: no watermark, no text, no duplication, no CGI, no blur, no distortion, no color shift, no overexposed light, no floating objects, no unrealistic pose, no children, no minors, no overly sexy or explicit clothing, no nudity, no suggestive pose, no copyrighted characters, no copyrighted logos, no trademarked content`


export const prompt_video = `Mô tả nhân vật/sản phẩm: Lấy y nguyên nhân vật/sản phẩm trong ảnh đầu vào .

Nhân vật không cần nói chuyện tôi sẽ chèn giọng nói sau . Nhân vật phải hoạt động hết khoảng thời gian của video, không bị đứng hình .

Đừng chèn chữ hay subtitle vào video

Bối cảnh: Trong một studio chuyên về quảng cáo sản phẩm phù hợp với thông tin sản phẩm bên dưới.

Mô tả hành động: Giữ nguyên hình ảnh đầu vào xuyên suốt video, chỉ tạo chuyển động, thay đổi góc máy cho hình ảnh phù hợp với thông tin sản phẩm bên dưới. 

Ánh sáng, góc máy phù hợp với hình ảnh và thông tin sản phẩm bên dưới.

Quality: ultra-detailed, hyper-realistic, photo-realistic, 8K UHD resolution, cinematic tone, clean composition, full-body framing with the entire model visible from head to toe, both feet touching the ground, and no cropping.

Negative: no watermark, no text, no logo, no duplication, no CGI, no blur, no distortion, no color shift, no overexposed light, no floating objects, no cropped frame, no unrealistic pose, no background`