import React from 'react'

export const StorageFiles = ({ activeCategory }) => {
  console.log(activeCategory);

    // Пример списка файлов, который можно фильтровать
    const files = [
      { name: ['file1.jpg', 'file2.jpg', 'file3.jpg'], type: 'photos' },
      { name: ['document1.pdf', 'document2.pdf', 'document3.pdf'], type: 'documents' },
      { name: ['video1.mp4', 'video2.mp4', 'video3.mp4'], type: 'videos' },
      { name: ['song1.mp3', 'song2.mp3', 'song3.mp3'], type: 'music' },
    ];



  const filteredFiles = activeCategory === 'all'
  ? files
  : files.filter(file => file.type === activeCategory);
  
  

  return (
    <>
         {/* Список файлов */}
         <div className="file-list">
        <h3>Файлы: {activeCategory}</h3>
        <ul>
          {filteredFiles.map((fileGroup, index) => (
            fileGroup.name.map((file, subIndex) => (
              <li key={`${index}-${subIndex}`}>{file}</li>
            ))
          ))}
        </ul>
      </div>
       </>
  )
}
