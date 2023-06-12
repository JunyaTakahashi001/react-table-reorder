import { useState } from 'react';
import { useQuery } from 'react-query';
import { useQueryClient } from 'react-query';

/**
 *データ取得にuseQueryを利用したパターンで制作してみた。
*/


// データ取得関数
const fetchUsers = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  return res.json();
};


const UserTable = () => {
  const [dragIndex, setDragIndex] = useState(null);
  const queryClient = useQueryClient();


  const { data, isLoading, isError, error, status } = useQuery('users', fetchUsers, {
    retry: 5, // リトライの回数をデフォルトの3回から5回へ変更
    refetchOnWindowFocus: false, // ブラウザに戻った時再度fetchするかの設定
    cacheTime: 5000, // キャッシュ時間(ms)
    refetchInterval: 10000, // ポーリング設定(ms)
    notifyOnChangeProps: ["data"], // dataプロパティのみ監視して再レンダリングを制御
  });

  // ロード中の処理
  if (isLoading) {
    return <span>Loading...</span>;
  }

 // データ取得に失敗した時の処理
  if (isError) {
    return <span>Error: {error.message}</span>;
  }


  // ドラッグ要素の取得
  const dragStart = (index) => {
    setDragIndex(index);
  };

  // 並べ替え処理
  const dragEnter = (index) => {
    if (index === dragIndex) return;

    queryClient.setQueryData(['users'], (prevState) => {
      let newUsers = JSON.parse(JSON.stringify(prevState));
      const deleteElement = newUsers.splice(dragIndex, 1)[0];
      newUsers.splice(index, 0, deleteElement);
      return newUsers;
    });

    setDragIndex(index);
  };

  // サーバへの並び替え後のデータ送信処理を追加
  const dragEnd = () => {
    setDragIndex(null)
  };

  return (
    <div style={{ margin: '2em' }}>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>名前</th>
            <th>ユーザ名</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, index) => (
            <tr
              key={user.id}
              draggable={true}
              onDragStart={() => dragStart(index)}
              onDragEnter={() => dragEnter(index)}
              onDragOver={(event) => event.preventDefault()} // 半透明の要素が元の場所に戻る動作を停止
              onDragEnd={dragEnd}
              className={index === dragIndex ? 'dragging' : ''}
            >
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;