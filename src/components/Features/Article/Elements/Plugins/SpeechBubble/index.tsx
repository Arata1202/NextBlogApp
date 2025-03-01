import { ContentBlock } from '@/libs/microcms';

type Props = {
  block: ContentBlock;
};

export default function SpeechBubble({ block }: Props) {
  return (
    <>
      <div className="my-10">
        <div className={`speech-bubble ${block.bubble_isRight ? 'right' : 'left'}`}>
          {block.bubble_image && (
            <div className={`bubble-image-wrapper ${block.bubble_isRight ? 'right' : 'left'}`}>
              <img
                src={block.bubble_image.url}
                alt="吹き出しのイメージ"
                width={75}
                height={75}
                className="bubble-image"
              />
            </div>
          )}
          <div className={`bubble-content ${block.bubble_isRight ? 'right' : 'left'}`}>
            <p className="bubble-text text-gray-700">{block.bubble_text}</p>
          </div>
        </div>
      </div>
    </>
  );
}
