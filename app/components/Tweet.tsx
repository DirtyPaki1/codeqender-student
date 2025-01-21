import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faTerminal, faBug, faLightbulb, faShareSquare } from "@fortawesome/free-solid-svg-icons";
import Image from 'next/image';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import styles from './tweet.module.css';

type Props = {
  tweet: string;
  imageSrc?: string;
};

const Tweet: React.FC<Props> = ({ tweet, imageSrc }) => {
  return (
    <div className={styles.tweetWrapper}>
      <div className={styles.inputBox}>
        <SyntaxHighlighter language="javascript" style={atomOneDark}>
          {tweet}
        </SyntaxHighlighter>
        {imageSrc && <Image src={imageSrc} alt={tweet} width={475} height={475} className={styles.image} />}
        <div className={styles.codeInfo}>
          <FontAwesomeIcon icon={faCode} />
          <span>Code Snippet</span>
        </div>
      </div>
      <div className={styles.bottom}>
        <ul className={styles.icons}>
          <li><FontAwesomeIcon icon={faTerminal} /></li>
          <li><FontAwesomeIcon icon={faBug} /></li>
          <li><FontAwesomeIcon icon={faLightbulb} /></li>
          <li><FontAwesomeIcon icon={faShareSquare} /></li>
        </ul>
        <div className={styles.content}>
          <span className={styles.counter}>280</span>
          <button className={styles.tweetButton}>Tweet</button>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
