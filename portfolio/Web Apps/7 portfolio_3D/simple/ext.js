export function getFileIcon(filename, isDir) {
    if (isDir) {
        return '📁';
    }
    
    const extension = filename.split('.').pop().toLowerCase();
    
    switch(extension) {
        case 'mp4':
        case 'mov':
        case 'avi':
        case 'mkv':
        case 'wmv':
        case 'webm':
            return '🎬';
        case 'pdf':
            return '📕';
        case 'doc':
        case 'docx':
            return '📘';
        case 'xls':
        case 'xlsx':
            return '📗';
        case 'ppt':
        case 'pptx':
            return '📓';
        case 'css':
            return '🎨';
        case 'js':
            return '📜';
        case 'zip':
        case 'rar':
        case '7z':
        case 'tar':
        case 'gz':
            return '📦';
        case 'txt':
        case 'md':
            return '📝';
        default:
            return '📄';
             case 'py': return '🐍'; 
        case 'js': return '📜'; 
        case 'ts': return '🟦'; 
        case 'java': return '☕'; 
        case 'c': return '🔷'; 
        case 'cpp': return '🔶'; 
        case 'cs': return '⬜'; 
        case 'go': return '🐹'; 
        case 'rs': return '🦀'; 
        case 'rb': return '💎'; 
        case 'php': return '🐘'; 
        case 'swift': return '🐦'; 
        case 'kt': return '🔴'; 
        case 'dart': return '🎯'; 
        case 'r': return '📊'; 
        case 'scala': return '⚡'; 
        case 'pl': return '🐪'; 
        case 'lua': return '🌙'; 
        case 'hs': return 'λ'; 
        case 'erl': return '⚗️'; 
        case 'ex': return '💧'; 
        case 'exs': return '💧'; 
        case 'clj': return '🧪'; 
        case 'cljs': return '🧪'; 
        case 'm': return '🔢'; 
        case 'sh': return '🐚'; 
        case 'bash': return '🐚'; 
        case 'zsh': return '🐚'; 
        case 'ps1': return '🔋'; 
        case 'vb': return '🔲'; 
        case 'vbs': return '🔲'; 
        case 'asm': return '⚙️'; 
        case 's': return '⚙️'; 
        case 'f': return '📐'; 
        case 'f90': return '📐'; 
        case 'f95': return '📐'; 
        case 'pas': return '🐫'; 
        case 'pp': return '🐫'; 
        case 'cob': return '💼'; 
        case 'cbl': return '💼'; 
        case 'lisp': return '📝'; 
        case 'lsp': return '📝'; 
        case 'scm': return '📝'; 
        case 'pro': return '🔍'; 
        case 'ml': return '🍄'; 
        case 'mli': return '🍄'; 
        case 'fs': return '🎯'; 
        case 'fsx': return '🎯'; 
        case 'groovy': return '🐵'; 
        case 'gy': return '🐵'; 
        case 'd': return '🐶'; 
        case 'nim': return '🎩'; 
        case 'v': return '🔌'; 
        case 'vh': return '🔌'; 
        case 'tcl': return '🦎'; 
        case 'jl': return '🧪'; 
        
        
        case 'html':
        case 'htm': return '🌐'; 
        case 'css': return '🎨'; 
        case 'scss': return '🎨'; 
        case 'sass': return '🎨'; 
        case 'less': return '🎨'; 
        case 'styl': return '🎨'; 
        case 'jsx': return '⚛️'; 
        case 'tsx': return '⚛️'; 
        case 'vue': return '🟢'; 
        case 'svelte': return '🟩'; 
        case 'elm': return '🌳'; 
        case 'ejs': return '📄'; 
        case 'pug': return '🐶'; 
        case 'jade': return '🐶'; 
        case 'hbs': return '🔨'; 
        case 'mustache': return '👄'; 
        case 'php': return '🐘'; 
        case 'asp': return '🔵'; 
        case 'aspx': return '🔵'; 
        case 'jsp': return '☕'; 
        case 'json': return '📋'; 
        case 'xml': return '📄'; 
        case 'yaml': return '📄'; 
        case 'yml': return '📄'; 
        case 'toml': return '⚙️'; 
        case 'svg': return '🖼️'; 
        case 'webmanifest': return '📱'; 
        
        
        case 'dart': return '🎯'; 
        case 'kt': return '🔴'; 
        case 'swift': return '🐦'; 
        case 'm': return '🍎'; 
        case 'mm': return '🍎'; 
        case 'xml': return '📱'; 
        case 'plist': return '🍎'; 
        case 'storyboard': return '📱'; 
        case 'xib': return '📱'; 
        case 'apk': return '📦'; 
        case 'ipa': return '📦'; 
        case 'aab': return '📦'; 
        
        
        case 'dart': return '🎯'; 
        case 'yaml': return '📄'; 
        case 'yml': return '📄'; 
        case 'pub': return '📦'; 
        
        
        case 'ino': return '🔌'; 
        case 'pde': return '🔌'; 
        case 'hex': return '📟'; 
        case 'bin': return '💾'; 
        case 'elf': return '🧝'; 
        case 'o': return '⚙️'; 
        case 'obj': return '⚙️'; 
        case 'so': return '📚'; 
        case 'a': return '📚'; 
        case 'dll': return '📚'; 
        case 'lib': return '📚'; 
        
        
        case 'dockerfile': return '🐳'; 
        case 'yml': return '📦'; 
        case 'yaml': return '📦'; 
        case 'tf': return '🏗️'; 
        case 'tfvars': return '🏗️'; 
        case 'tfstate': return '🏗️'; 
        case 'hcl': return '🏗️'; 
        case 'nomad': return '🏕️'; 
        case 'packer': return '📦'; 
        case 'pkr': return '📦'; 
        case 'vagrantfile': return '📦'; 
        case 'ppk': return '🔑'; 
        case 'pem': return '🔐'; 
        case 'crt': return '🔒'; 
        case 'key': return '🔑'; 
        case 'p12': return '📄'; 
        case 'pfx': return '📄'; 
        
        
        case 'proto': return '📡'; 
        case 'pb': return '📡'; 
        case 'grpc': return '📡'; 
        
        
        case 'gradle': return '🐘'; 
        case 'xml': return '📦'; 
        case 'pom': return '📦'; 
        case 'json': return '📦'; 
        case 'lock': return '🔒'; 
        case 'gemfile': return '💎'; 
        case 'gemfile.lock': return '🔒'; 
        case 'cargo': return '📦'; 
        case 'cargo.lock': return '🔒'; 
        case 'makefile': return '⚙️'; 
        case 'mk': return '⚙️'; 
        case 'cmake': return '⚙️'; 
        case 'ninja': return '🥷'; 
        
        
        case 'sql': return '🗄️'; 
        case 'db': return '💾'; 
        case 'sqlite': return '💾'; 
        case 'sqlite3': return '💾'; 
        case 'mdb': return '📊'; 
        case 'accdb': return '📊'; 
        case 'dbf': return '📊'; 
        case 'mdf': return '📊'; 
        case 'ndf': return '📊'; 
        case 'bak': return '💾'; 
        case 'dump': return '💾'; 
        case 'bson': return '📋'; 
        case 'cql': return '📋'; 
        
        
        case 'md': return '📖'; 
        case 'markdown': return '📖'; 
        case 'txt': return '📄'; 
        case 'rtf': return '📄'; 
        case 'pdf': return '📕'; 
        case 'doc': return '📘'; 
        case 'docx': return '📘'; 
        case 'xls': return '📗'; 
        case 'xlsx': return '📗'; 
        case 'ppt': return '📓'; 
        case 'pptx': return '📓'; 
        case 'odt': return '📄'; 
        case 'ods': return '📊'; 
        case 'odp': return '📽️'; 
        case 'epub': return '📚'; 
        case 'mobi': return '📚'; 
        case 'azw': return '📚'; 
        case 'chm': return '📚'; 
        
        
        case 'ico':
        case 'icns':
        case 'tiff':
        case 'tif': return '🖼️'; 
        case 'psd':
        case 'ai':
        case 'sketch':
        case 'fig':
        case 'xd': return '🎨'; 
        case 'raw':
        case 'cr2':
        case 'nef':
        case 'arw':
        case 'dng': return '📷'; 
        case 'eps': return '📄'; 
        case 'indd': return '📰'; 
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp':
        case 'webp':
        case 'svg':
            return '🖼️';
        
        
        case 'wav':
        case 'flac':
        case 'aac':
        case 'ogg':
        case 'oga':
        case 'm4a':
        case 'wma':
        case 'aiff':
        case 'aif':
        case 'mid':
        case 'midi':
        case 'opus':
        case 'mp3':
        case 'wav':
        case 'flac':
        case 'aac':
        case 'ogg':
            return '🎵';
        
        
        case 'mp4':
        case 'mov':
        case 'avi':
        case 'mkv':
        case 'webm':
        case 'flv':
        case 'wmv':
        case 'm4v':
        case 'mpg':
        case 'mpeg':
        case '3gp':
        case 'vob':
        case 'ogv':
        case 'm2ts':
        case 'ts':
        case 'mts':
        case 'rm':
        case 'rmvb': return '🎬';
        
        
        case 'zip':
        case 'rar':
        case '7z':
        case 'tar':
        case 'gz':
        case 'bz2':
        case 'xz':
        case 'lz':
        case 'lzma':
        case 'lzo':
        case 'z':
        case 'arj':
        case 'cab':
        case 'deb':
        case 'rpm':
        case 'msi':
        case 'pkg': return '📦'; 
        case 'dmg':
        case 'iso': return '💿'; 
        
        
        case 'exe': return '⚙️'; 
        case 'msi': return '📦'; 
        case 'deb': return '📦'; 
        case 'rpm': return '📦'; 
        case 'apk': return '📦'; 
        case 'app': return '📦'; 
        case 'bat': return '⚙️'; 
        case 'cmd': return '⚙️'; 
        case 'com': return '⚙️'; 
        case 'scr': return '🖥️'; 
        case 'jar': return '☕'; 
        case 'war': return '☕'; 
        case 'ear': return '☕'; 
        
        
        case 'ini': return '⚙️'; 
        case 'cfg': return '⚙️'; 
        case 'conf': return '⚙️'; 
        case 'config': return '⚙️'; 
        case 'properties': return '⚙️'; 
        case 'prop': return '⚙️'; 
        case 'env': return '🔧'; 
        case 'gitignore': return '🔒'; 
        case 'gitattributes': return '🔧'; 
        case 'gitmodules': return '📚'; 
        case 'editorconfig': return '⚙️'; 
        case 'htaccess': return '🔧'; 
        case 'htpasswd': return '🔒'; 
        
        
        case 'ttf': return '🔤'; 
        case 'otf': return '🔤'; 
        case 'woff': return '🔤'; 
        case 'woff2': return '🔤'; 
        case 'eot': return '🔤'; 
        case 'fon': return '🔤'; 
        case 'fnt': return '🔤'; 
        
        
        case 'stl': return '🔺'; 
        case 'obj': return '🔷'; 
        case 'fbx': return '📦'; 
        case 'blend': return '🎨'; 
        case 'max': return '📐'; 
        case 'ma': return '📐'; 
        case 'mb': return '📐'; 
        case 'dwg': return '📐'; 
        case 'dxf': return '📐'; 
        case 'step': return '📐'; 
        case 'iges': return '📐'; 
        case 'igs': return '📐'; 
        
        
        case 'vdi': return '💻'; 
        case 'vmdk': return '💻'; 
        case 'vhd': return '💻'; 
        case 'vhdx': return '💻'; 
        case 'ova': return '📦'; 
        case 'ovf': return '📦'; 
        
        
        case 'unity': return '🎮'; 
        case 'unitypackage': return '📦'; 
        case 'uproject': return '🎮'; 
        case 'uasset': return '🎮'; 
        case 'gam': return '🎮'; 
        case 'gmx': return '🎮'; 
        case 'love': return '❤️'; 
        case 'pk3': return '📦'; 
        case 'pk4': return '📦'; 
        case 'wad': return '📦'; 
        case 'rom': return '🎮'; 
        case 'nes': return '🎮'; 
        case 'smc': return '🎮'; 
        case 'gb': return '🎮'; 
        case 'gbc': return '🎮'; 
        case 'gba': return '🎮'; 
        case 'nds': return '🎮'; 
        case '3ds': return '🎮'; 
        case 'cia': return '🎮'; 
        case 'nsp': return '🎮'; 
        case 'xci': return '🎮'; 
        
        
        case 'csv': return '📊'; 
        case 'tsv': return '📊'; 
        case 'xlsx': return '📊'; 
        case 'sav': return '📊'; 
        case 'mat': return '📊'; 
        case 'hdf5': return '📊'; 
        case 'h5': return '📊'; 
        case 'nc': return '📊'; 
        case 'fits': return '🌌'; 
        case 'root': return '📊'; 
        
        
        case 'epub': return '📚'; 
        case 'mobi': return '📚'; 
        case 'azw': return '📚'; 
        case 'azw3': return '📚'; 
        case 'fb2': return '📚'; 
        case 'djvu': return '📚'; 
        case 'chm': return '📚'; 
        case 'oxps': return '📄'; 
        case 'xps': return '📄'; 
        
        
        case 'pem': return '🔐'; 
        case 'crt': return '🔒'; 
        case 'cer': return '🔒'; 
        case 'der': return '🔒'; 
        case 'pfx': return '📄'; 
        case 'p12': return '📄'; 
        case 'key': return '🔑'; 
        case 'pub': return '🔑'; 
        case 'gpg': return '🔒'; 
        case 'asc': return '🔒'; 
        case 'sig': return '✍️'; 
        
        
        case 'url': return '🌐'; 
        case 'webloc': return '🌐'; 
        case 'html': return '🌐'; 
        case 'htm': return '🌐'; 
        case 'css': return '🎨'; 
        case 'js': return '📜'; 
        case 'mhtml': return '🌐'; 
        case 'rss': return '📰'; 
        case 'atom': return '📰'; 
        
        
        case 'bak': return '💾'; 
        case 'tmp': return '📄'; 
        case 'temp': return '📄'; 
        case 'swp': return '📄'; 
        case 'swo': return '📄'; 
        case 'cache': return '📄'; 
        
        
        case 'log': return '📋'; 
        case 'license': return '📄'; 
        case 'licence': return '📄'; 
        case 'readme': return '📖'; 
        case 'todo': return '📝'; 
        case 'changelog': return '📋'; 
        case 'contributing': return '👥'; 
        case 'authors': return '👥'; 
        case 'credits': return '👥'; 
    }
}

export function getFolderColor(folderName) {
    
    let color = 0xffa500;
    
    
    const startingNumberMatch = folderName.match(/^(\d+)/);
    if (startingNumberMatch) {
        const numberValue = parseInt(startingNumberMatch[1]);
        
        
        if (numberValue >= 10) {
            color = 0x990000; 
        } else if (numberValue >= 1) {
            
            const intensity = numberValue / 9; 
            const r1 = 255, g1 = 165, b1 = 0; 
            const r2 = 255, g2 = 0, b2 = 0;   
            
            const r = Math.round(r1 + (r2 - r1) * intensity);
            const g = Math.round(g1 + (g2 - g1) * intensity);
            const b = Math.round(b1 + (b2 - b1) * intensity);
            
            color = (r << 16) | (g << 8) | b;
        }
    }
    
    return color;
}


export const fileExtensions = {
    
    document: [
        { ext: '.pdf', type: 'Document', description: 'PDF Document - Portable Document Format file. Contains formatted text and images.' },
        { ext: '.txt', type: 'Text', description: 'Text File - Plain text file. Can be opened with any text editor.' },
        { ext: '.rtf', type: 'Document', description: 'Rich Text File - Supports formatted text with various fonts and styles.' },
        { ext: '.md', type: 'Markdown', description: 'Markdown File - Lightweight markup language for formatted text.' },
        { ext: '.doc / .docx', type: 'Document', description: 'Word Document - Microsoft Word document. Contains formatted text and images.' },
        { ext: '.xls / .xlsx', type: 'Spreadsheet', description: 'Excel Spreadsheet - Microsoft Excel spreadsheet. Contains tabular data and formulas.' }
    ],
    
    
    image: [
        { ext: '.jpg / .jpeg', type: 'Image', description: 'JPEG Image - Common format for photographs with lossy compression.' },
        { ext: '.png', type: 'Image', description: 'PNG Image - Supports transparency and lossless compression.' },
        { ext: '.gif', type: 'Image', description: 'GIF Image - Supports animation and limited color palette.' },
        { ext: '.bmp', type: 'Image', description: 'Bitmap Image - Uncompressed image format storing pixel data.' },
        { ext: '.webp', type: 'Image', description: 'WebP Image - Modern image format with superior compression.' },
        { ext: '.svg', type: 'Vector', description: 'SVG Vector Image - Scalable vector graphics based on XML.' }
    ],
    
    
    code: [
        { ext: '.html / .htm', type: 'Web', description: 'HTML Document - HyperText Markup Language file. Defines the structure of a web page.' },
        { ext: '.css', type: 'Web', description: 'CSS Stylesheet - Cascading Style Sheets file. Defines the presentation of web pages.' },
        { ext: '.js', type: 'Web', description: 'JavaScript File - Contains code for web page interactivity.' },
        { ext: '.ts', type: 'Web', description: 'TypeScript File - Typed superset of JavaScript that compiles to plain JavaScript.' },
        { ext: '.php', type: 'Server', description: 'PHP Script - Server-side scripting language for web development.' },
        { ext: '.py', type: 'Script', description: 'Python Script - Contains Python programming code.' },
        { ext: '.java', type: 'Code', description: 'Java Source File - Contains Java programming code.' },
        { ext: '.c', type: 'Code', description: 'C Source File - Contains C programming language code.' },
        { ext: '.cpp', type: 'Code', description: 'C++ Source File - Contains C++ programming language code.' },
        { ext: '.cs', type: 'Code', description: 'C# Source File - Contains C# programming language code.' },
        { ext: '.json', type: 'Data', description: 'JSON Data File - JavaScript Object Notation for data interchange.' },
        { ext: '.xml', type: 'Data', description: 'XML Data File - Extensible Markup Language for structured data.' }
    ],
    
    
    media: [
        { ext: '.mp4', type: 'Video', description: 'MP4 Video - Common format for digital video with good compression.' },
        { ext: '.mov', type: 'Video', description: 'QuickTime Video - Apple\'s video format often used in professional editing.' },
        { ext: '.avi', type: 'Video', description: 'AVI Video - Audio Video Interleave format developed by Microsoft.' },
        { ext: '.mkv', type: 'Video', description: 'Matroska Video - Open standard container format that can hold unlimited video, audio, and subtitle tracks.' },
        { ext: '.wmv', type: 'Video', description: 'Windows Media Video - Microsoft\'s proprietary video format.' },
        { ext: '.webm', type: 'Video', description: 'WebM Video - Royalty-free format designed for web use.' },
        { ext: '.mp3', type: 'Audio', description: 'MP3 Audio - Compressed format for digital audio, widely supported.' },
        { ext: '.wav', type: 'Audio', description: 'WAV Audio - Uncompressed audio format developed by IBM and Microsoft.' },
        { ext: '.flac', type: 'Audio', description: 'FLAC Audio - Free Lossless Audio Codec for high-quality audio.' },
        { ext: '.aac', type: 'Audio', description: 'AAC Audio - Advanced Audio Coding, successor to MP3 with better quality.' },
        { ext: '.ogg', type: 'Audio', description: 'OGG Audio - Open, free container format maintained by Xiph.Org Foundation.' }
    ],
    
    
    archive: [
        { ext: '.zip', type: 'Archive', description: 'ZIP Archive - Common compression format supporting lossless data compression.' },
        { ext: '.rar', type: 'Archive', description: 'RAR Archive - Proprietary archive format supporting compression and error recovery.' },
        { ext: '.7z', type: 'Archive', description: '7-Zip Archive - Open source archive format with high compression ratio.' },
        { ext: '.tar', type: 'Archive', description: 'TAR Archive - Tape Archive format common on Unix systems, often compressed with gzip or bzip2.' },
        { ext: '.gz', type: 'Archive', description: 'GZIP Compressed File - Compression format using the DEFLATE algorithm.' }
    ],
    
    
    executable: [
        { ext: '.exe', type: 'Executable', description: 'Executable File - Directly executable program on Windows systems.' },
        { ext: '.msi', type: 'Installer', description: 'Windows Installer - Microsoft installation package format.' },
        { ext: '.bat', type: 'Script', description: 'Batch File - Script file containing series of commands for Windows command interpreter.' },
        { ext: '.sh', type: 'Script', description: 'Shell Script - Script file containing commands for Unix/Linux shell.' }
    ],
    
    
    data: [
        { ext: '.csv', type: 'Data', description: 'Comma Separated Values - Plain text format for tabular data with comma separators.' }
    ]
};


export function getFileType(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    const typeMap = {
        'pdf': 'PDF Document',
        'txt': 'Text File',
        'rtf': 'Rich Text File',
        'md': 'Markdown File',
        'doc': 'Word Document',
        'docx': 'Word Document',
        'xls': 'Excel Spreadsheet',
        'xlsx': 'Excel Spreadsheet',
        'jpg': 'JPEG Image',
        'jpeg': 'JPEG Image',
        'png': 'PNG Image',
        'gif': 'GIF Image',
        'bmp': 'Bitmap Image',
        'webp': 'WebP Image',
        'svg': 'SVG Vector Image',
        'html': 'HTML Document',
        'htm': 'HTML Document',
        'css': 'CSS Stylesheet',
        'js': 'JavaScript File',
        'ts': 'TypeScript File',
        'php': 'PHP Script',
        'py': 'Python Script',
        'java': 'Java Source File',
        'c': 'C Source File',
        'cpp': 'C++ Source File',
        'cs': 'C# Source File',
        'json': 'JSON Data File',
        'xml': 'XML Data File',
        'mp4': 'MP4 Video',
        'mov': 'QuickTime Video',
        'avi': 'AVI Video',
        'mkv': 'Matroska Video',
        'wmv': 'Windows Media Video',
        'webm': 'WebM Video',
        'mp3': 'MP3 Audio',
        'wav': 'WAV Audio',
        'flac': 'FLAC Audio',
        'aac': 'AAC Audio',
        'ogg': 'OGG Audio',
        'zip': 'ZIP Archive',
        'rar': 'RAR Archive',
        '7z': '7-Zip Archive',
        'tar': 'TAR Archive',
        'gz': 'GZIP Compressed File',
        'csv': 'Comma Separated Values',
        'exe': 'Executable File',
        'msi': 'Windows Installer',
        'bat': 'Batch File',
        'sh': 'Shell Script'
    };
    
    return typeMap[extension] || `${extension.toUpperCase()} File`;
}


export function generateDescription(filename, isDir) {
    if (isDir) {
        const descriptors = [
            "This folder contains project files and resources.",
            "A collection of related documents and media.",
            "Organized directory for easy file management.",
            "Contains assets and materials for your projects.",
            "Storage location for your creative work."
        ];
        return descriptors[Math.floor(Math.random() * descriptors.length)];
    }
    
    const extension = filename.split('.').pop().toLowerCase();
    
    switch(extension) {
        case 'pdf':
            return "Portable Document Format file. Contains formatted text and images.";
        case 'txt':
            return "Plain text file. Can be opened with any text editor.";
        case 'jpg':
        case 'jpeg':
            return "JPEG image file. Common format for photographs.";
        case 'png':
            return "PNG image file. Supports transparency and lossless compression.";
        case 'html':
            return "HyperText Markup Language file. Defines the structure of a web page.";
        case 'css':
            return "Cascading Style Sheets file. Defines the presentation of web pages.";
        case 'js':
            return "JavaScript file. Contains code for web page interactivity.";
        case 'py':
            return "Python script file. Contains Python programming code.";
        case 'mp4':
            return "MP4 video file. Common format for digital video.";
        case 'mp3':
            return "MP3 audio file. Compressed format for digital audio.";
        case 'docx':
            return "Microsoft Word document. Contains formatted text and images.";
        case 'xlsx':
            return "Microsoft Excel spreadsheet. Contains tabular data and formulas.";
        default:
            return "Try to download instead";
    }
}


export function getColorForExtension(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    
    switch(extension) {
        case 'pdf':
            return 0xF44336; 
        case 'txt':
        case 'rtf':
        case 'md':
            return 0xFFFFFF; 
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp':
        case 'webp':
        case 'svg':
            return 0x4CAF50; 
        case 'html':
        case 'htm':
        case 'css':
        case 'js':
        case 'ts':
        case 'php':
        case 'py':
        case 'java':
        case 'c':
        case 'cpp':
        case 'cs':
        case 'json':
        case 'xml':
            return 0xFF9800; 
        case 'doc':
        case 'docx':
            return 0x2196F3; 
        case 'xls':
        case 'xlsx':
        case 'csv':
            return 0x4CAF50; 
        case 'mp4':
        case 'mov':
        case 'avi':
        case 'mkv':
        case 'wmv':
        case 'webm':
            return 0x9C27B0; 
        case 'zip':
        case 'rar':
        case '7z':
        case 'tar':
        case 'gz':
            return 0x795548; 
        case 'mp3':
        case 'wav':
        case 'flac':
        case 'aac':
        case 'ogg':
            return 0x607D8B; 
        case 'exe':
        case 'msi':
        case 'bat':
        case 'sh':
            return 0xF44336; 
        default:
            return 0x9E9E9E; 
    }
}


