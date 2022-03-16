var simplemde = new SimpleMDE({ 
    element: document.getElementById("ta"),
    forceSync: true,
    spellChecker: false
});







let data;
let index = 0;

document.getElementById("inputfile").addEventListener("change", function () {
  var fr = new FileReader();
  fr.onload = function () {
    data = JSON.parse(fr.result)
    render()
  };

  fr.readAsText(this.files[0]);
});

document.getElementById('btnNext').addEventListener('click', () => {
    index++
    render()
})

document.getElementById('btnPrev').addEventListener('click', () => {
    index--
    render()
})

document.getElementById('btnSave').addEventListener('click', () => {
    save()
})

const ta = document.getElementById('ta')
const pre = document.getElementById('output')

// ta.addEventListener('change', () => {
//     data[index].references = ta.value
// })

simplemde.codemirror.on("change", function(){
    data[index].references = simplemde.value()

});

let textFile = null

makeTextFile = function (text) {
    var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    return textFile;
};

function render() {
    if (index >= data.length) {
        return
    }
    
    const i = data[index]

    // ta.value = data[index].references
    simplemde.value(data[index].references)

    pre.innerText = `${index + 1}/${data.length}\nTitle: ${i.title}\n`
}

function save() {
    var link = document.createElement('a');
    link.setAttribute('download', 'backup.json');
    link.href = makeTextFile(JSON.stringify(data));
    document.body.appendChild(link);

    // wait for the link to be added to the document
    window.requestAnimationFrame(function () {
      var event = new MouseEvent('click');
      link.dispatchEvent(event);
      document.body.removeChild(link);
    });
}

