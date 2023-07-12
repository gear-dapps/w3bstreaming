import { useAtomValue } from 'jotai';
import { useParams } from 'react-router';
import { useAccount } from '@gear-js/react-hooks';
import { Watch, Broadcast } from '@/features/Stream/components';

import { STREAM_TEASERS_ATOM } from '@/atoms';
import { Layout } from '@/features/Stream/components/Layout';
import { socket } from '@/utils';

function StreamPage() {
  const { account } = useAccount();
  const { id: streamId } = useParams();
  const streamTeasers = useAtomValue(STREAM_TEASERS_ATOM);

  const streamTeaser = streamTeasers?.[streamId as string];

  return (
    <div>
      {streamTeaser && (
        <>
          <div>
            {account?.decodedAddress === streamTeaser.broadcaster ? (
              <Broadcast socket={socket} streamId={streamId as string} />
            ) : (
              <Watch socket={socket} streamId={streamId as string} />
            )}
          </div>
          <Layout
            isBroadcaster={account?.decodedAddress === streamTeaser.broadcaster}
            title={streamTeaser.title}
            description={streamTeaser.description}
          />
        </>
      )}
    </div>
  );
}

export { StreamPage };
